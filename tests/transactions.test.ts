import request from "supertest";
import server from "../src/server";
import { setupTestDatabase, teardownTestDatabase } from "./test.setup";

describe("Server test", () => {
  let user: any;
  let userAccessToken: any;

  beforeAll(async () => {
    await setupTestDatabase();

    // register a test user
    user = await request(server).post("/api/v1/auth/register").send({
      email: "janedoe@email.com",
      firstName: "jane",
      lastName: "doe",
      password: "passworded",
    });

    // login registered user to test wallet route
    userAccessToken = await request(server).post("/api/v1/auth/login").send({
      email: "janedoe@email.com",
      password: "passworded",
    });
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe("GET /api/v1/", () => {
    it("should return a 200 response code and message", async () => {
      const response = await request(server).get("/api/v1/").expect(200);
      expect(response.body).toHaveProperty("message", "welcome");
    });
  });
});
