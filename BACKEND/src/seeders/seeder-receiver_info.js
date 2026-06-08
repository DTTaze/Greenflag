"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("receiver_informations", [
      {
        id: 1,
        user_id: 1,
        to_name: "Nguyen Van A",
        to_phone: "0901234567",
        to_address: "106 Nguyen Van Dau, Phuong 7, Binh Thanh, TP HCM",
        to_ward_name: "Phường 7",
        to_district_name: "Quận Bình Thạnh",
        to_province_name: "Hồ Chí Minh",
        account_type: "home",
        is_default: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        user_id: 2,
        to_name: "Tran Thi B",
        to_phone: "0912345678",
        to_address: "123 Le Loi, Phuong 5, Quan 3, TP HCM",
        to_ward_name: "Phường 5",
        to_district_name: "Quận 3",
        to_province_name: "Hồ Chí Minh",
        account_type: "office",
        is_default: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("receiver_informations", null, {});
  },
};
