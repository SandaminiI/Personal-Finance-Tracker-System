import request from "supertest";
import { app, server } from "../../server.js";
import transactionModel from "../../models/transactionModel.js";
import jwt from "jsonwebtoken"; // For authentication

jest.mock("../../models/transactionModel.js"); // Mock Transaction Model

const mockUser = { _id: "123456789", name: "Test User" };
const mockToken = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Transaction Controller - Create Transaction", () => {
  afterAll(() => {
    server.close(); // Close the server after tests
  });

  it("should return an error for missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/transactions/createtransaction")
      .set("Authorization", mockToken) // Provide token
      .send({ category: "Groceries" }); // Missing required fields

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return an error for invalid transaction type", async () => {
    const res = await request(app)
      .post("/api/v1/transactions/createtransaction")
      .set("Authorization", mockToken) // Provide token
      .send({
        userId: "123456789",
        type: "invalidType", // Invalid transaction type
        category: "Groceries",
        amount: 2000,
        currency: "LKR",
        date: "2025-03-10",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Error in creating transaction");
  });
});
