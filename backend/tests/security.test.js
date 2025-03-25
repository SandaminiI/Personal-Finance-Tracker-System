import request from "supertest";
import { app, server } from "../server.js";

jest.setTimeout(10000); // 🔧 Increase test timeout to 10 seconds

describe("🛡️ Security API Tests", () => {
  afterAll(() => {
    server.close(); // Close the server after tests
  });

  /**
   * ✅ Prevents Cross-Site Scripting (XSS)
   */
  it("should prevent XSS attacks in user registration", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "<script>alert('XSS')</script>",
        email: "xss@example.com",
        phone: "1234567890",
        address: "123 Main St",
        password: "password123"
      });

    expect(res.statusCode).toBe(200); // Registration should still be successful
    expect(res.body.success).toBe(false);

    if (res.body.user) {
      expect(res.body.user.name).not.toContain("<script>"); // Ensure stored name is sanitized
    }
  });

  /**
   * ✅ Requires passwords for login
   */
  it("should prevent login without a password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "johndoe@example.com" }); // Missing password

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch("Invalid email or password");
  });
});
