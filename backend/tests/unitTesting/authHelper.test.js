import { hashPassword, comparePassword } from "../../helpers/authHelper.js";

describe("Auth Helper Functions", () => {
  it("should hash a password correctly", async () => {
    const password = "securePassword123";
    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).not.toEqual(password);
    expect(hashedPassword.length).toBeGreaterThan(10);
  });

  it("should compare a hashed password correctly", async () => {
    const password = "securePassword123";
    const hashedPassword = await hashPassword(password);
    
    const isMatch = await comparePassword(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const password = "securePassword123";
    const hashedPassword = await hashPassword(password);

    const isMatch = await comparePassword("wrongPassword", hashedPassword);
    expect(isMatch).toBe(false);
  });
});
