const { z } = require("zod");

/**
 * Preprocesses input values, converting empty strings, whitespace-only strings,
 * or nulls into undefined, allowing optional fields to be omitted safely.
 * @param {z.ZodType} schema - The Zod schema to apply after preprocessing.
 * @returns {z.ZodEffects}
 */
const emptyToUndefined = (schema) =>
  z.preprocess((val) => {
    if (val === "" || val === null || (typeof val === "string" && val.trim() === "")) {
      return undefined;
    }
    return val;
  }, schema);

module.exports = { emptyToUndefined };
