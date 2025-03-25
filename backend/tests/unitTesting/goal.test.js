import request from "supertest";
import mongoose from "mongoose";
import goalModel from "../../models/goalModel.js";
import { app } from "../../server.js";

// ✅ Mock MongoDB Model to Avoid Real DB Calls
jest.mock("../../models/goalModel.js");

// ✅ Mock Authentication Middleware
jest.mock("../../middlewares/authMiddleware.js", () => ({
  requireSignIn: (req, res, next) => {
    req.user = { _id: "mockUserId" }; // Mock User ID
    next();
  },
  isAdmin: (req, res, next) => {
    next();
  },
}));

// ✅ Mock Auth Controllers to Avoid Import Errors
jest.mock("../../controllers/authController.js", () => ({
  registerController: (req, res) => res.send("Mock Register Success"),
  loginController: (req, res) => res.send("Mock Login Success"),
  testController: (req, res) => res.send("Mock Test Success"),
}));

// Ensure Jest Does Not Hang
jest.setTimeout(20000);

describe("🎯 Goal API Unit Tests", () => {
  let goalId = "mocked_goal_id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Create a Goal Successfully
  it("should create a new goal successfully", async () => {
    const newGoal = {
      _id: goalId,
      title: "Save for a car",
      targetAmount: 5000,
      deadline: "2025-12-31",
      autoSavePercentage: 10,
    };

    goalModel.prototype.save = jest.fn().mockResolvedValue(newGoal);

    const res = await request(app)
      .post("/api/v1/goals/create-goal")
      .send(newGoal);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

})