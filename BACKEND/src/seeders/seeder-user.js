const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

("use strict");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        id: 1,
        public_id: nanoid(),
        role_id: 1, // Admin
        google_id: null,
        email: "admin@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "admin",
        full_name: "Admin User",
        phone_number: "0907713012",
        rank_id: 1,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746718905/avatars/sjya6w8uj53rjsa0trla.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        public_id: nanoid(),
        role_id: 2, // User
        google_id: null,
        email: "user@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "user",
        full_name: "Normal User",
        phone_number: "0788529112",
        rank_id: 2,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746718918/avatars/dv79x5hzo3id9ssrnwlb.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        public_id: nanoid(),
        role_id: 3, // Customer
        google_id: null,
        email: "customer@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "customer",
        full_name: "Normal User",
        phone_number: "0346024177",
        rank_id: 3,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746729040/avatars/giqnk58t6g7aw7obwnwp.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        public_id: nanoid(),
        role_id: 3,
        google_id: null,
        email: "john.doe@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "johndoe",
        full_name: "John Doe",
        phone_number: "0898693660",
        rank_id: 4,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746581627/avatars/p2olhpe0hjxcmldhggvn.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        public_id: nanoid(),
        role_id: 2,
        google_id: null,
        email: "jane.smith@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "janesmith",
        full_name: "Jane Smith",
        phone_number: "0708681209",
        rank_id: 5,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746855505/images/f3149daa-7858-4d16-a3c8-237cbd88e210_ijyls7.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        public_id: nanoid(),
        role_id: 2,
        google_id: null,
        email: "david.nguyen@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "davidnguyen",
        full_name: "David Nguyen",
        phone_number: "7897849789",
        rank_id: 6,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746581627/avatars/p2olhpe0hjxcmldhggvn.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        public_id: nanoid(),
        role_id: 2,
        google_id: null,
        email: "sophia.lee@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "sophialee",
        full_name: "Sophia Lee",
        phone_number: "1591529159",
        rank_id: 7,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746896378/avatars/abdaff8c-0ce5-4f75-86b7-420f85fc7cba_k9gmqd.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        public_id: nanoid(),
        role_id: 2,
        google_id: null,
        email: "michael.brown@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "michaelbrown",
        full_name: "Michael Brown",
        phone_number: "7537563753",
        rank_id: 8,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746896514/avatars/tien-ao-pi_uxzzud.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        public_id: nanoid(),
        role_id: 3, // Customer
        google_id: null,
        email: "emma.wilson@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "emmawilson",
        full_name: "Emma Wilson",
        phone_number: "9519514951",
        rank_id: 9,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746896623/avatars/fe04a19a-9f3e-4ac3-85e2-7c4023053607_ir1d8s.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        public_id: nanoid(),
        role_id: 2, // User
        google_id: null,
        email: "oliver.jones@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "oliverjones",
        full_name: "Oliver Jones",
        phone_number: "3573575357",
        rank_id: 10,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746896704/avatars/7872f704-f7f6-45d5-bfe2-b346bf02e950_xjdmww.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        public_id: nanoid(),
        role_id: 1, // Admin
        google_id: null,
        email: "lucas.martin@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "lucasmartin",
        full_name: "Lucas Martin",
        phone_number: "1237896456",
        rank_id: 11,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746896801/avatars/a27a86a1-9509-4a30-9540-81100775348b_uralsi.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        public_id: nanoid(),
        role_id: 3, // Customer
        google_id: null,
        email: "mia.davis@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "miadavis",
        full_name: "Mia Davis",
        phone_number: "4564123789",
        rank_id: 12,
        avatar_url:
          "https://res.cloudinary.com/dygavzq8m/image/upload/v1746897177/avatars/3902e7a3e2e57df9dc5e254e41cde03d_xkfizh.jpg",
        last_completed_task: Sequelize.literal("CURDATE() - INTERVAL 1 DAY"),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
