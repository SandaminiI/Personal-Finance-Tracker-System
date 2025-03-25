import budgetModel from "../../models/budgetModel.js";

describe("Budget Model Tests", () => {
  it("should reject budget creation without required fields", async () => {
    try {
      const budget = new budgetModel({}); // Missing required fields
      await budget.validate(); // This should throw an error
    } catch (error) {
      expect(error.errors.category).toBeDefined();
      expect(error.errors.amount).toBeDefined();
      expect(error.errors.month).toBeDefined();
      expect(error.errors.year).toBeDefined();
    }
  });
});
