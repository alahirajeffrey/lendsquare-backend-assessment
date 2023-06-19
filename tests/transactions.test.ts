import request from "supertest";
import server from "../src/server";
import { setupTestDatabase, teardownTestDatabase } from "./test.setup";

describe("Transactions test", () => {
  let firstUser: any;
  let firstUserAccessToken: any;
  let firstUserWallet: any;
  let secondUser: any;
  let secondUserAccessToken: any;
  let secondUserWallet: any;

  beforeAll(async () => {
    await setupTestDatabase();

    // register a first test user
    firstUser = await request(server).post("/api/v1/auth/register").send({
      email: "janedoe@email.com",
      firstName: "jane",
      lastName: "doe",
      password: "passworded",
    });

    // login registered user to test transactions route
    firstUserAccessToken = await request(server)
      .post("/api/v1/auth/login")
      .send({
        email: "janedoe@email.com",
        password: "passworded",
      });

    // create wallet for first user
    firstUserWallet = await request(server)
      .post("/api/v1/wallet/create-wallet")
      .send({
        userId: firstUser._body.data.id,
      })
      .set({
        authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
      });

    // register a second test user
    secondUser = await request(server).post("/api/v1/auth/register").send({
      email: "johndoe@email.com",
      firstName: "jane",
      lastName: "doe",
      password: "passworded",
    });

    // login second registered user to test transactions route
    secondUserAccessToken = await request(server)
      .post("/api/v1/auth/login")
      .send({
        email: "johndoe@email.com",
        password: "passworded",
      });

    // create wallet for second user
    secondUserWallet = await request(server)
      .post("/api/v1/wallet/create-wallet")
      .send({
        userId: secondUser._body.data.id,
      })
      .set({
        authorization: `Bearer ${secondUserAccessToken._body.accessToken}`,
      });
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe("PATCH /api/v1/transaction/fund-account/wallet/:walleId", () => {
    it("should return a 404 response code if wallet does not exist", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/fund-account/wallet/5c32fe74-3986-4e20-b054-4e6a15d848bb`
        )
        .send({
          amount: 1000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 404);
      expect(response.body).toHaveProperty("message", "wallet does not exist");
    });

    it("should return a 200 response if wallet is funded", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/fund-account/wallet/${firstUserWallet._body.data.id}`
        )
        .send({
          amount: 5000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 200);
      expect(response.body).toHaveProperty("message", "account funded");
    });
  });

  describe("PATCH /api/v1/transaction/withdrawal/wallet/:walleId", () => {
    it("should return a 404 response code if wallet does not exist", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/withdrawal/wallet/5c32fe74-3986-4e20-b054-4e6a15d848bb`
        )
        .send({
          amount: 1000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 404);
      expect(response.body).toHaveProperty("message", "wallet does not exist");
    });

    it("should return a 400 response if balance is insufficient", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/withdrawal/wallet/${firstUserWallet._body.data.id}`
        )
        .send({
          amount: 10000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 400);
      expect(response.body).toHaveProperty("message", "insufficient balance");
    });

    it("should return a 200 response if withdrawal is successful", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/withdrawal/wallet/${firstUserWallet._body.data.id}`
        )
        .send({
          amount: 1000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 200);
      expect(response.body).toHaveProperty("message", "withdrawal successful");
    });
  });

  describe("PATCH /api/v1/transaction/transfer/wallet/:senderWalleId/:recieverWalletId", () => {
    it("should return a 404 response code if sender's wallet does not exist", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/transfer/wallet/5c32fe74-3986-4e20-b054-4e6a15d848bb/5c32fe74-3986-4e20-b054-4e6a15d848bb`
        )
        .send({
          amount: 1000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 404);
      expect(response.body).toHaveProperty("message", "wallet does not exist");
    });

    it("should return a 404 response code if reciever's wallet does not exist", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/transfer/wallet/${firstUserWallet._body.data.id}/5c32fe74-3986-4e20-b054-4e6a15d848bb`
        )
        .send({
          amount: 1000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 404);
      expect(response.body).toHaveProperty(
        "message",
        "reciever's wallet does not exist"
      );
    });

    it("should return a 400 response if balance is insufficient", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/transfer/wallet/${firstUserWallet._body.data.id}/${secondUserWallet._body.data.id}`
        )
        .send({
          amount: 10000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 400);
      expect(response.body).toHaveProperty("message", "insufficient balance");
    });

    it("should return a 200 response if transfer is successful", async () => {
      const response = await request(server)
        .patch(
          `/api/v1/transaction/transfer/wallet/${firstUserWallet._body.data.id}/${secondUserWallet._body.data.id}`
        )
        .send({
          amount: 1000,
        })
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });
      expect(response.statusCode == 200);
      expect(response.body).toHaveProperty("message", "transfer successful");
    });
  });

  describe("GET /api/v1/transaction/wallet/:walletId", () => {
    it("should return a list of transactions", async () => {
      const response = await request(server)
        .get(`/api/v1/transaction/wallet/${firstUserWallet._body.data.id}`)
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });
      expect(response.statusCode == 200);
      expect(response.body).toHaveProperty("message", "transaction details");
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.totalPages).toBe(1);
      expect(response.body.data.transactions).toBeInstanceOf(Array);
    });

    it("should return a 404 response code if wallet does not exist", async () => {
      const response = await request(server)
        .get(`/api/v1/transaction/wallet/5c32fe74-3986-4e20-b054-4e6a15d848bb`)
        .set({
          authorization: `Bearer ${firstUserAccessToken._body.accessToken}`,
        });

      expect(response.statusCode == 404);
      expect(response.body).toHaveProperty("message", "wallet does not exist");
    });
  });
});
