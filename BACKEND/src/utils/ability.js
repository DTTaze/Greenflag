import { AbilityBuilder, PureAbility } from "@casl/ability";

import { Permission, Role, User } from "../models";

export const defineAbilitiesFor = async (user) => {
  const { can, build } = new AbilityBuilder(PureAbility);

  if (!user?.id) {
    throw new Error("Invalid user or user does not exist");
  }

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

    if (!userWithRoles || !userWithRoles.roles) {
      throw new Error("User not found or does not have any assigned roles");
    }

    const roles = Array.isArray(userWithRoles.roles) ? userWithRoles.roles : [userWithRoles.roles];

    const permissions = roles.flatMap((role) =>
      Array.isArray(role.permissions) ? role.permissions : [role.permissions],
    );

    if (permissions.length === 0) {
      throw new Error("User does not have any permissions");
    }

    permissions.forEach(({ action, subject }) => {
      can(action, subject);
    });

    return build();
  } catch (error) {
    throw new Error(`Error defining permissions: ${error.message}`);
  }
};
