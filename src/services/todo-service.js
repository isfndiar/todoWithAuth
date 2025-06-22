import { ResponseError } from "../exception/ResponseError.js";
import TodoModel from "../model/TodoModel.js";
import TagModel from "../model/TagModel.js";
import UserModel from "../model/UserModel.js";
import todoValidation from "../validation/todo-validation.js";
import validation from "../validation/validation.js";
const create = async (id, request) => {
  const { title, description, deadline, tags } = await validation(
    todoValidation.create,
    request
  );

  const findUser = await UserModel.findById(id);
  if (!findUser) {
    throw new ResponseError(400, "user not found");
  }

  // Process tags
  const tags_id = await Promise.all(
    tags.map(async (tag) => {
      const findTag = await TagModel.findOne({ name: tag });
      if (findTag) {
        return findTag._id;
      }
      const newTag = await TagModel.create({ name: tag });
      return newTag._id;
    })
  );

  // Create todo
  await TodoModel.create({
    title,
    description,
    deadline,
    tags_id,
    user_id: id,
  });

  return { title, description, deadline, tags };
};

const get = async (email) => {
  const emailRequest = await validation(todoValidation.get, email);
  const user = await UserModel.findOne({ email: emailRequest });

  if (!user) {
    throw new ResponseError(400, "User not found");
  }

  const todos = await TodoModel.find({ user_id: user._id }).lean(); // Use lean for plain objects

  // Remove unnecessary fields
  const cleanedTodos = await Promise.all(
    todos.map(
      async ({ _id, title, description, deadline, is_checked, tags_id }) => {
        const tagDocs = await TagModel.find({ _id: { $in: tags_id } }).lean();
        const tagNames = tagDocs.map((tag) => tag.name);
        return {
          id: _id,
          title,
          description,
          deadline,
          is_checked,
          tags: tagNames,
        };
      }
    )
  );
  return cleanedTodos;
};

const update = async (req) => {
  const request = await validation(todoValidation.update, req);

  const todo = await TodoModel.findOne({
    _id: request.id,
    user_id: request.userId,
  });

  if (!todo) {
    throw new ResponseError(400, "Todo not found");
  }
  if (request.title) todo.title = request.title;
  if (request.description) todo.description = request.description;
  if (request.deadline) todo.deadline = request.deadline;

  // Update tags by names (like in create)
  if (request.tags && Array.isArray(request.tags)) {
    // Process tags: ensure all exist and get their IDs
    const tags_id = await Promise.all(
      request.tags.map(async (tag) => {
        let tagDoc = await TagModel.findOne({ name: tag });
        if (!tagDoc) {
          tagDoc = await TagModel.create({ name: tag });
        }
        return tagDoc._id;
      })
    );
    // Remove duplicates
    todo.tags_id = [...new Set(tags_id.map((id) => id.toString()))];
  }

  await todo.save();

  // Cleaned return (like in get)
  const tagDocs = await TagModel.find({ _id: { $in: todo.tags_id } }).lean();
  const tagNames = tagDocs.map((tag) => tag.name);
  return {
    id: todo._id,
    title: todo.title,
    description: todo.description,
    deadline: todo.deadline,
    is_checked: todo.is_checked,
    tags: tagNames,
  };
};

const checked = async (request) => {
  const { userId, id, isChecked } = await validation(
    todoValidation.checked,
    request
  );

  const todo = await TodoModel.findOne({ _id: id, user_id: userId });
  if (!todo) {
    throw new ResponseError(404, "Todo not found!");
  }
  if (todo.is_checked == isChecked)
    throw new ResponseError(400, "already checked");
  todo.is_checked = isChecked;
  await todo.save();
  return { isChecked: todo.is_checked };
};

const remove = async (request) => {
  const { userId, todosId } = request;
  const todo = await TodoModel.findOneAndDelete({
    _id: todosId,
    user_id: userId,
  });
  if (!todo) {
    throw new ResponseError(404, "Todo not found!");
  }

  return "Todo Deleted";
};
export default { create, get, update, checked, remove };
