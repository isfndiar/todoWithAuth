import express from "express";

// middleware
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import todoController from "../controller/todo-controller.js";
import limiter from "../middleware/rate-limiter.js";
export const api = express.Router();
const blockedIP = new Set(["123.123.123.123", "111.111.111.111"]);

api.use(authMiddleware);
api.use(limiter);
api.get("/", (req, res, next) => {
  const ip = req.ip;
  if (blockedIP.some((prefix) => ip.startsWith(prefix))) {
    return res
      .status(403)
      .json({ errors: "Access Denied. Your IP has been blocked" });
  }

  res.status(400).json({ ip: ip });
});

api.get("/api/user", userController.get);
api.get("/api/todos", todoController.get);
api.post("/api/todos/create", todoController.create);
api.patch("/api/todo/:id/checked", todoController.checked);
api.patch("/api/todo/:id", todoController.update);
api.delete("/api/todo/:id", todoController.remove);
