const ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  CUSTOMER: "customer",
});

const ASSIGNABLE_ROLES = Object.freeze([ROLES.USER, ROLES.CUSTOMER]);
const DEFAULT_ROLE_ID = 2;

module.exports = {
  ROLES,
  ASSIGNABLE_ROLES,
  DEFAULT_ROLE_ID,
};
