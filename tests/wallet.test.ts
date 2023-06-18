import request from "supertest";
import server from "../src/server";
import { setupTestDatabase, teardownTestDatabase } from "./test.setup";

describe("Wallet tests", () => {
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

  describe("POST /api/v1/wallet/create-wallet", () => {
    it("should return a 200 response code and an access token", async () => {
      const response = await request(server)
        .post("/api/v1/wallet/create-wallet")
        .send({ userId: user._body.data.id })
        .set({ authorization: `Bearer ${userAccessToken._body.accessToken}` });
      expect(response.statusCode == 201);
      expect(response.body).toHaveProperty("message", "wallet created");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("walletId");
      expect(response.body.data).toHaveProperty("balance", 0);
    });

    it("should return a 400 response code when you try to create 2 wallets for a user", async () => {
      const response = await request(server)
        .post("/api/v1/wallet/create-wallet")
        .send({ userId: user._body.data.id })
        .set({ authorization: `Bearer ${userAccessToken._body.accessToken}` });
      expect(response.statusCode == 400);
      expect(response.body).toHaveProperty(
        "message",
        "you cannot create more than one wallet"
      );
    });
  });

  describe("GET /api/v1/wallet/user/:userId", () => {
    it("should return a 200 code and a wallet object", async () => {
      const response = await request(server)
        .get(`/api/v1/wallet/user/${user._body.data.id}`)
        .set({ authorization: `Bearer ${userAccessToken._body.accessToken}` });
      expect(response.statusCode == 200);
      expect(response.body).toHaveProperty("message", "wallet found");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("balance", 0);
      expect(response.body.data).toHaveProperty("balance");
    });

    it("should return a 404 error if user has not created a wallet", async () => {
      const response = await request(server)
        .get(`/api/v1/wallet/user/5c32fe74-3986-4e20-b054-4e6a15d848bb`)
        .set({ authorization: `Bearer ${userAccessToken._body.accessToken}` });
      expect(response.statusCode == 404);
      expect(response.body).toHaveProperty("message", "wallet does not exist");
    });
  });
});
