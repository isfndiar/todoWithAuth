import express from "express";
import dotenv from "dotenv";
dotenv.config();
// middleware
import cors from "cors";
import { errorMiddleware } from "../middleware/error-middleware.js";
import limiter from "../middleware/rate-limiter.js";
import passport from "passport";
import helmet from "helmet";
// Route
import { apiPublic } from "../routes/api-public.js";
import { api } from "../routes/api.js";
import authRoutes from "../routes/auth.js";
// database
import connectDatabase from "./database.js";
// swagger
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../config/swagger.js";

connectDatabase();

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false, // nggak perlu karena ini API, bukan web page
    crossOriginEmbedderPolicy: false, // disable kalau nggak pakai fitur media
    hidePoweredBy: true, // hapus header "X-Powered-By: Express"
    frameguard: false, // nggak perlu, karena API nggak pakai iframe
    hsts: {
      maxAge: 60 * 60 * 24 * 30, // 30 hari, karena portofolio (bisa lebih pendek)
      preload: false,
      includeSubDomains: true,
    },
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: false, // nggak perlu, karena ini API
    dnsPrefetchControl: { allow: false },
    ieNoOpen: true,
    noSniff: true,
  })
);

app.use(passport.initialize());

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// limiter / api block
app.use(limiter);

app.use((req, res, next) => {
  console.log("Incoming request from IP:", req.ip);
  next();
});
app.use("/auth", authRoutes);
app.use(apiPublic);
app.use(api);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port :", `http://localhost:${PORT}/`);
});

export default app;
