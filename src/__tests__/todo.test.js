import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../application/app.js";

describe("Todo Operations", () => {
  // initialize
  let authToken;
  let userId;
  let server;

  beforeAll(async () => {
    // create database tmporarry
    server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    // First register a user
    const registerResponse = await request(app)
      .post("/api/user/register")
      .send({
        username: "naninani",
        email: "nani089@gmail.com",
        password: "rahasia",
        confirmPassword: "rahasia",
      });

    expect(registerResponse.status).toBe(201);
    // Then login to get the token
    const loginResponse = await request(app).post("/api/user/login").send({
      email: "nani089@gmail.com",
      password: "rahasia",
    });

    expect(loginResponse.status).toBe(200);

    authToken = loginResponse.body.data.token;
    userId = loginResponse.body.data.payload.id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.stop();
  });

  describe("GET /api/todos/create", () => {
    const todoData = {
      title: "Date bareng Furina",
      description: "Jalan jalan sama Furina 💕",
      tags: ["istri", "Jalan-jalan"],
      deadline: new Date(Date.now() + 86400000),
    };
    it("should create new todo", async () => {
      let res = await request(app)
        .post("/api/todos/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(todoData);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("title", todoData.title);
      expect(res.body.data).toHaveProperty("description", todoData.description);
    });
  });

  describe("GET /api/todos", () => {
    it("should get all todos", async () => {
      let res = await request(app)
        .get("/api/todos")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
