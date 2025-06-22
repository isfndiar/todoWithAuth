import jwt from "jsonwebtoken";

// This file will be used for our custom authentication middleware
// We'll implement our own authentication logic here

export const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      statusCode: 401,
      errors: "Unauthorized",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const jwtDecode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = jwtDecode;
    next(); // Pindahkan ke dalam try jika ingin pastikan hanya jalan kalau token valid
  } catch (error) {
    console.error("JWT verification failed:", error.message); // Optional, untuk dev
    return res.status(401).json({
      statusCode: 401,
      errors: "Unauthorized",
    });
  }
};

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Please log in to access this resource" });
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
};
