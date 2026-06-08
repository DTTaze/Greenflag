const { removeSpecialChars } = require("../../src/utils/stringUtils");

describe("StringUtils Unit Tests", () => {
  describe("removeSpecialChars", () => {
    it("should remove non-alphanumeric special characters", () => {
      expect(removeSpecialChars("Hello @World!!!")).toBe("Hello World");
      expect(removeSpecialChars("Task #1 - Green Energy")).toBe("Task 1 Green Energy");
    });

    it("should preserve Vietnamese Unicode characters", () => {
      expect(removeSpecialChars("Nhiệm vụ xanh")).toBe("Nhiệm vụ xanh");
    });

    it("should compress multiple spaces to a single space", () => {
      expect(removeSpecialChars("Hello    World")).toBe("Hello World");
    });

    it("should return empty string if input is not a string", () => {
      expect(removeSpecialChars(null)).toBe("");
      expect(removeSpecialChars(123)).toBe("");
    });
  });
});
