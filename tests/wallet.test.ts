import request from "supertest";
import server from "../src/server";
import logger from "../src/helpers/logger";

describe("Wallet tests", () => {
  let user: any;
  let userAccessToken: any;

  beforeAll(async () => {
    // register user to test wallet route
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

    logger.info(user._body);
    logger.info(userAccessToken._body);
  });

  describe("POST /api/v1/wallet/create-wallet", () => {
    it("should return a 200 response code and an access token", async () => {
      const response = await request(server)
        .get("/api/v1/wallet/create-wallet")
        .send({ userId: user.data.id })
        .set({ authorization: `Bearer ${userAccessToken.accessToken}` })
        .expect(200);
      expect(response.body).toHaveProperty("message", "wallet created");
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("balance", 0);
    });

    it("should return a 400 response code when you try to create 2 wallets for a user", async () => {
      const response = await request(server)
        .get("/api/v1/wallet/create-wallet")
        .send({ userId: user.data.id })
        .set({ authorization: `Bearer ${userAccessToken.accessToken}` })
        .expect(400);
      expect(response.body).toHaveProperty(
        "message",
        "you cannot create more than one wallet"
      );
    });
  });
});
