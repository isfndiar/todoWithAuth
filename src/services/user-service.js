import { ResponseError } from "../exception/ResponseError.js";
import userValidation from "../validation/user-validation.js";
import validation from "../validation/validation.js";
import UserModel from "../model/UserModel.js";
import TodoModel from "../model/TodoModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (request) => {
  const userRequest = await validation(userValidation.register, request);

  // Check if email is already registered
  const existingUser = await UserModel.findOne({
    email: userRequest.email,
  });

  if (existingUser) {
    // If user exists but doesn't have a password, allow them to set one
    if (existingUser.isGoogleUser && !existingUser.password) {
      const hashedPassword = await bcrypt.hash(userRequest.password, 10);
      existingUser.password = hashedPassword;
      existingUser.username = userRequest.username;
      await existingUser.save();

      const userObj = existingUser.toObject();
      delete userObj.password;
      return { user: userObj };
    }
    throw new ResponseError(400, "Email already registered!");
  }

  const hashedPassword = await bcrypt.hash(userRequest.password, 10);

  const user = await UserModel.create({
    username: userRequest.username,
    email: userRequest.email,
    password: hashedPassword,
    isGoogleUser: false,
  });

  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj };
};

const login = async (request) => {
  const userRequest = await validation(userValidation.login, request);

  const user = await UserModel.findOne({ email: userRequest.email });
  if (!user) {
    throw new ResponseError(400, "Invalid credentials");
  }

  // If user is a Google user but doesn't have a password yet
  if (user.isGoogleUser && !user.password) {
    throw new ResponseError(400, "Invalid credentials");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    userRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(400, "Invalid credentials");
  }

  const payload = {
    id: user.id,
    email: user.email,
  };
  const expire = 60 * 60 * 100; // 1 jam
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expire,
  });

  return { payload: payload, token: token };
};

const get = async (email) => {
  const emailRequest = await validation(userValidation.get, email);
  const user = await UserModel.findOne({ email: emailRequest });
  console.log(emailRequest);
  if (!user) {
    throw new ResponseError(400, "User not found!");
  }

  const todo = await TodoModel.find({ user_id: user.id })
    .select("-__v -_id -user_id ")
    .populate({
      path: "tags_id",
      select: "-__v -_id ",
    });

  return { username: user.username, email: user.email, todos: todo };
};

export default { register, login, get };
