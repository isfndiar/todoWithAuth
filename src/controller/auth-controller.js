import authService from "../services/auth-service.js";

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await authService.get(user);
    result.ip = req.ip;
    res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { get };
