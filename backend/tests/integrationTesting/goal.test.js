import request from "supertest";
import { app, server } from "../../server.js";
import jwt from "jsonwebtoken";

describe("Goal API Integration Tests", () => {
  let token;

  beforeAll(async () => {
    token = jwt.sign({ _id: "mockUserId" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    server.close();
  });

 

  it("should return 400 for missing required fields", async () => {
    const res = await request(app)
      .post("/api/v1/goals/create-goal")
      .set("Authorization", token)
      .send({ title: "Buy a New Car" }); // Missing targetAmount and deadline

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });

//   it("should return 401 if user is not authenticated", async () => {
//     const res = await request(app)
//       .post("/api/v1/goals/create-goal") // No token provided
//       .send({
//         title: "Buy a New Car",
//         targetAmount: 15000,
//         deadline: "2025-12-31",
//         autoSavePercentage: 10,
//       });

//     expect(res.statusCode).toBe(401);
//     expect(res.body.success).toBe(false);
//     expect(res.body.message).toBe("Unauthorized");
//   });
});
