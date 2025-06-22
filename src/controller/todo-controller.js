import todoService from "../services/todo-service.js";

const get = async (req, res, next) => {
  try {
    const email = req.user.email;

    const result = await todoService.get(email);
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    next(error);
  }
};
const create = async (req, res, next) => {
  try {
    const request = req.body;
    const userId = req.user.id;
    const result = await todoService.create(userId, request);
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const request = req.body;
    const todosId = req.params.id;
    const userId = req.user.id;

    request.id = todosId;
    request.userId = userId;
    const result = await todoService.update(request);
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    next(error);
  }
};
const remove = async (req, res, next) => {
  try {
    const request = { userId: req.user.id, todosId: req.params.id };
    const result = await todoService.remove(request);
    res.status(200).json({ status: "ok", message: result });
  } catch (error) {
    next(error);
  }
};
const checked = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todosId = req.params.id;
    const request = req.body;
    request.id = todosId;
    request.userId = userId;
    const result = await todoService.checked(request);
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    next(error);
  }
};

export default { get, create, remove, checked, update };
