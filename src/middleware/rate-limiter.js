import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 60 * 2000, // 2 jam
  max: 100,
  message: {
    errors: "too many request, please try again later",
    statusCode: 429,
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
