const db = require("../../src/models");

const seedRoles = async () => {
  await db.Role.bulkCreate([
    { id: 1, name: "admin", description: "Administrator" },
    { id: 2, name: "user", description: "Regular User" },
    { id: 3, name: "customer", description: "Customer" },
    { id: 4, name: "shipper", description: "Shipper" },
  ], { ignoreDuplicates: true });

  // Seed item upload permission (action: post, subject: item_id)
  const [permission] = await db.Permission.findOrCreate({
    where: { action: "post", subject: "item_id" },
    defaults: { id: 15 }
  });

  // Associate permission with regular user role (role_id 2)
  await db.RolePermission.findOrCreate({
    where: { role_id: 2, permission_id: permission.id }
  });
};

module.exports = {
  seedRoles,
};
