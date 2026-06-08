import { AbilityBuilder, createMongoAbility } from "@casl/ability";

import db from "../models";

const { User, Role, Permission } = db;

export const defineAbilitiesFor = async (user, permissions = null) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (!user || !user.id) {
    return build();
  }

  let userPermissions = permissions;

  // Database fallback if permissions not pre-fetched/cached
  if (!userPermissions) {
    try {
      const userWithRoles = await User.findByPk(user.id, {
        include: [
          {
            model: Role,
            as: "roles",
            include: [
              {
                model: Permission,
                as: "permissions",
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      const roles = userWithRoles?.roles
        ? Array.isArray(userWithRoles.roles)
          ? userWithRoles.roles
          : [userWithRoles.roles]
        : [];

      userPermissions = roles.flatMap((role) =>
        Array.isArray(role.permissions) ? role.permissions : [role.permissions],
      );
    } catch (error) {
      console.error("Error fetching user permissions in defineAbilitiesFor:", error);
      userPermissions = [];
    }
  }

  // Get user role name
  const roleName = user.role_name || user.role?.name || user.roles?.name;

  if (roleName === "admin") {
    can("manage", "all");
  } else {
    // 1. Static RBAC permissions mapping (Normalized from DB to standard REST/CASL verbs)
    if (Array.isArray(userPermissions)) {
      userPermissions.forEach((p) => {
        if (p && p.action && p.subject) {
          // Normalize action
          let normalizedAction = p.action.toLowerCase();
          if (normalizedAction === "post") normalizedAction = "create";
          else if (normalizedAction === "put" || normalizedAction === "patch")
            normalizedAction = "update";
          else if (normalizedAction === "get") normalizedAction = "read";

          // Normalize subject
          let normalizedSubject = p.subject;
          if (normalizedSubject === "user_id") normalizedSubject = "User";
          else if (normalizedSubject === "role_id") normalizedSubject = "Role";
          else if (normalizedSubject === "role_permission") normalizedSubject = "RolePermission";
          else if (normalizedSubject === "permission_id") normalizedSubject = "Permission";
          else if (normalizedSubject === "task_id") normalizedSubject = "Task";
          else if (normalizedSubject === "item_id") normalizedSubject = "Item";
          else if (normalizedSubject === "transaction_id") normalizedSubject = "Transaction";

          if (normalizedSubject === "task") normalizedSubject = "Task";
          if (normalizedSubject === "role") normalizedSubject = "Role";
          if (normalizedSubject === "permission") normalizedSubject = "Permission";
          if (normalizedSubject === "transaction") normalizedSubject = "Transaction";

          can(normalizedAction, normalizedSubject);
        }
      });
    }

    // 2. Dynamic ABAC ownership permissions mapping
    // Task & TaskSubmit ownership
    can(["update", "delete"], "Task", { user_id: user.id });
    can(["update", "delete"], "TaskSubmit", { user_id: user.id });

    // Item ownership
    can(["update", "delete"], "Item", { seller_id: user.id });

    // Transaction ownership and custom actions
    can("read", "Transaction", { buyer_id: user.id });
    can("read", "Transaction", { seller_id: user.id });
    can(["cancel", "complete"], "Transaction", { buyer_id: user.id });
    can(["accept", "reject", "ship"], "Transaction", { seller_id: user.id });

    // User ownership
    can(["read", "update", "delete"], "User", { id: user.id });

    // PII Ownership Enforcement
    can(["read", "update", "delete"], "ReceiverInformation", { user_id: user.id });
    can(["read", "update", "delete"], "DeliveryAccount", { user_id: user.id });
  }

  return build();
};
