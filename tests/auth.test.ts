import request from "supertest";
import server from "../src/server";

describe("Auth test", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should register a new user and return a 201 response", async () => {
      await request(server)
        .post("/api/v1/auth/register")
        .send({
          email: "johndoe@gmail.com",
          firstName: "John",
          lastName: "Doe",
          password: "passworded",
        })
        .expect(201);
    });

    it("should return a 500 error if user already exists", async () => {
      const response = await request(server)
        .post("/api/v1/auth/register")
        .send({
          email: "johndoe@gmail.com",
          firstName: "John",
          lastName: "Doe",
          password: "passworded",
        })
        .expect(500);
      expect(response.body).toHaveProperty("message");
    });
  });
});

describe("Login test", () => {
  describe("POST /api/v1/auth/login", () => {
    it("should login user and return a 200 response", async () => {
      await request(server)
        .post("/api/v1/auth/login")
        .send({
          email: "johndoe@gmail.com",
          password: "passworded",
        })
        .expect(200);
    });

    it("should return a 401 error if password is incorrect", async () => {
      const response = await request(server)
        .post("/api/v1/auth/login")
        .send({
          email: "johndoe@gmail.com",
          password: "passworded2",
        })
        .expect(401);
      expect(response.body).toHaveProperty("message", "incorrect password");
    });

    it("should return a 404 error if user does not exist", async () => {
      const response = await request(server)
        .post("/api/v1/auth/login")
        .send({
          email: "johndoe2@gmail.com",
          password: "passworded2",
        })
        .expect(404);
      expect(response.body).toHaveProperty("message", "user does not exist");
    });
  });
});
