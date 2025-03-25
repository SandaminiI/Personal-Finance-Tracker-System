import request from "supertest";
import { app, server } from "../../server.js";
import jwt from "jsonwebtoken";

describe("Budget API Integration Tests", () => {
  let token;

  beforeAll(async () => {
    // Generate a test JWT token (assuming JWT_SECRET is in .env)
    token = jwt.sign({ _id: "mockUserId" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    server.close();
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/budgets/setBudget")
      .set("Authorization", token) // Authenticate request
      .send({ category: "Food" }); // Missing required fields

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });
});
