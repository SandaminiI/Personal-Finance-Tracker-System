import request from "supertest";
import { app, server } from "../../server.js";
import budgetModel from "../../models/budgetModel.js";
import jwt from "jsonwebtoken"; // Import JWT for token creation

jest.mock("../../models/budgetModel.js"); // Mock the Budget model

const mockUser = { _id: "123456789", name: "Test User" };
const mockToken = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: "1h" }); // Generate a test token

describe("Budget Controller - Create/Update Budget", () => {
  afterAll(() => {
    server.close(); // Close the server after tests
  });

  it("should create a new budget", async () => {
    const mockBudget = {
      userId: "123456789",
      category: "Food",
      amount: 10000,
      month: 3,
      year: 2025,
    };

    budgetModel.findOne.mockResolvedValue(null); // No existing budget
    budgetModel.prototype.save = jest.fn().mockResolvedValue(mockBudget);

    const res = await request(app)
      .post("/api/v1/budgets/setBudget")
      .set("Authorization", mockToken) // Provide token for authentication
      .send(mockBudget);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Budget set successfully");
  });

  it("should update an existing budget", async () => {
    const existingBudget = {
      _id: "budget123",
      userId: "123456789",
      category: "Food",
      amount: 5000,
      month: 3,
      year: 2025,
      save: jest.fn().mockResolvedValue(true),
    };

    budgetModel.findOne.mockResolvedValue(existingBudget);

    const updatedBudget = {
      ...existingBudget,
      amount: 8000,
    };

    const res = await request(app)
      .post("/api/v1/budgets/setBudget")
      .set("Authorization", mockToken) // Provide token
      .send(updatedBudget);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Budget updated successfully");
  });

  it("should return an error for missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/budgets/setBudget")
      .set("Authorization", mockToken) // Provide token
      .send({ category: "Food" }); // Missing required fields

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });
});
