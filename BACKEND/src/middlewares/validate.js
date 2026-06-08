const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return res.error(400, "Validation failed", errors);
  }
  req.validated = result.data;
  next();
};

module.exports = validate;
