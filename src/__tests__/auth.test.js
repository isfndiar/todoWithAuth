import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../application/app.js";

describe("Auth Endpoints", () => {
  let mongoServer;
  let authToken;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("POST /api/user/register", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/api/user/register").send({
        username: "naninani",
        email: "nani089@gmail.com",
        password: "rahasia",
        confirmPassword: "rahasia",
      });

      expect(res.statusCode).toBe(201);
    });
  });

  describe("POST /api/user/login", () => {
    it("should user login", async () => {
      const res = await request(app)
        .post("/api/user/login")
        .send({ email: "nani089@gmail.com", password: "rahasia" });
      authToken = res.body.data.token;
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/user", () => {
    it("should get user data ", async () => {
      const res = await request(app)
        .get("/api/user")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(200);
    });
  });
});
