import { ResponseError } from "../exception/ResponseError.js";

export const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof ResponseError) {
    res
      .status(err.statusCode)
      .json({ errors: err.message, statusCode: err.statusCode });
  } else {
    res.status(500).json({ errors: err.message });
  }
};
