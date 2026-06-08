const { defineAbilitiesFor } = require("../utils/ability.js");
const roleRepo = require("../repositories/roleRepository");
const db = require("../models");
const { getCache, setCache } = require("../utils/cache");
const { CACHE_KEYS, CACHE_TTL } = require("../constants/cacheKeys");
const ForbiddenError = require("../errors/ForbiddenError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const requirePermission = (action, subject) => {
  return async (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError("Vui lòng đăng nhập");
    }

    const roleId = req.user.role_id;
    if (!roleId) {
      throw new ForbiddenError("Người dùng không có vai trò hợp lệ");
    }

    const cacheKey = CACHE_KEYS.IDENTITY.ROLE_PERMISSIONS(roleId);
    let permissions = await getCache(cacheKey);

    if (!permissions) {
      const role = await roleRepo.findById(roleId, {
        include: [{ model: db.Permission, as: "permissions" }],
      });

      permissions =
        role && role.permissions
          ? role.permissions.map((p) => ({
              id: p.id,
              action: p.action,
              subject: p.subject,
            }))
          : [];

      await setCache(cacheKey, permissions, CACHE_TTL.ONE_DAY);
    }

    // Ensure role name is attached to user for defineAbilitiesFor check
    if (!req.user.role_name) {
      const roleCacheKey = CACHE_KEYS.IDENTITY.ROLE_BY_ID(roleId);
      let roleData = await getCache(roleCacheKey);
      if (!roleData) {
        const role = await roleRepo.findById(roleId, { raw: true, nest: true });
        if (role) {
          roleData = role;
          await setCache(roleCacheKey, roleData, CACHE_TTL.ONE_DAY);
        }
      }
      if (roleData) {
        req.user.role_name = roleData.name;
      }
    }

    req.ability = await defineAbilitiesFor(req.user, permissions);

    if (req.ability.can(action, subject)) {
      return next();
    }

    throw new ForbiddenError(
      `Bạn không có quyền thực hiện hành động [${action}] trên [${subject}]`,
    );
  };
};

module.exports = requirePermission;
