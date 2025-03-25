import request from "supertest";
import { app, server } from "../../server.js";

describe("Auth API Integration Tests", () => {
  afterAll(() => {
    server.close(); // Close the server after tests
  });

  it("should not register an already existing user", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        address: "123 Main St",
        password: "password123"
      });

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        address: "123 Main St",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Already Registered please Login");
  });
});
