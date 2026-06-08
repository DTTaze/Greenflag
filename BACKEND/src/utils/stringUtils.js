const removeSpecialChars = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
};

module.exports = {
  removeSpecialChars,
};
