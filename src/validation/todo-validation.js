import Joi from "joi";

const create = Joi.object({
  title: Joi.string().min(3).max(255).required().trim(),
  description: Joi.string().max(255).required().trim(),
  tags: Joi.array().items(Joi.string()),
  createdAt: Joi.date().default(Date.now()),
  deadline: Joi.date().greater(Joi.ref("createdAt")),
});

const update = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required(),
  title: Joi.string().min(3).max(255).trim(),
  description: Joi.string().max(255).trim(),
  tags: Joi.array().items(Joi.string()),
  createdAt: Joi.date().default(Date.now()),
  deadline: Joi.date().greater(Joi.ref("createdAt")),
});

const remove = Joi.boolean();

const checked = Joi.object({
  isChecked: Joi.boolean(),
  userId: Joi.string().required(),
  id: Joi.string().required(),
});

const get = Joi.string().email().required();
export default { create, get, checked, remove, update };
