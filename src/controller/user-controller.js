import userServices from "../services/user-service.js";
const register = async (req, res, next) => {
  try {
    const request = req.body;
    await userServices.register(request);
    res.status(201).json({ statusCode: 201, message: "ok" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await userServices.login(request);
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const request = req.user.email;
    const result = await userServices.get(request);
    res.status(200).json({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  get,
};
