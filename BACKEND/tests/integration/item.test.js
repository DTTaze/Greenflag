const request = require("supertest");
const app = require("../../src/server");
const db = require("../../src/models");
const { getAuthHeaders } = require("../helpers/authHelper");

describe("Item Integration Tests", () => {
  let user;
  let authHeaders;

  beforeEach(async () => {
    // Recreate user and seed
    const rank = await db.Rank.create({ amount: 0, order: 9999 });
    user = await db.User.create({
      email: "seller@example.com",
      username: "selleruser",
      password: "password123",
      full_name: "Seller User",
      role_id: 2, // regular user role
      rank_id: rank.id,
      public_id: "seller-pub-id",
    });
    await rank.update({ user_id: user.id });
    await db.Coin.create({ amount: 1000, user_id: user.id });

    authHeaders = getAuthHeaders(user.id);
  });

  afterEach(async () => {
    // Cleanup items and users
    await db.Item.destroy({ where: {} });
    await db.User.destroy({ where: {} });
    await db.Coin.destroy({ where: {} });
    await db.Rank.destroy({ where: {} });
  });

  describe("POST /api/items/upload", () => {
    it("should successfully upload a new item", async () => {
      const res = await request(app)
        .post("/api/items/upload")
        .set(authHeaders)
        .field("name", "Test Item")
        .field("price", 100)
        .field("stock", 10)
        .field("weight", 500)
        .field("length", 10)
        .field("width", 10)
        .field("height", 10)
        .attach("images", Buffer.from("image content"), "item.jpg");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("name", "Test Item");
      expect(res.body.data).toHaveProperty("creator_id", user.id);
    });
  });

  describe("POST /api/items/purchase/:item_id", () => {
    let item;
    let receiverInfo;

    beforeEach(async () => {
      // Create receiver information
      receiverInfo = await db.ReceiverInformation.create({
        user_id: user.id,
        to_name: "Receiver Name",
        to_phone: "0908235279",
        to_address: "123 Street Address",
        to_ward_name: "Ward 1",
        to_district_name: "District 1",
        to_province_name: "Province 1",
        is_default: true,
      });

      // Create an item to purchase
      item = await db.Item.create({
        name: "Purchase Item",
        price: 50,
        stock: 5,
        weight: 100,
        length: 5,
        width: 5,
        height: 5,
        creator_id: user.id,
        status: "available",
        public_id: "test-item-purchase-id",
      });
    });

    it("should purchase an item successfully, creating a transaction and reducing stock", async () => {
      const res = await request(app)
        .post(`/api/items/purchase/${item.id}`)
        .set(authHeaders)
        .send({
          name: "Purchase Item",
          quantity: 1,
          receiver_information_id: receiverInfo.id,
          to_name: "Receiver Name",
          to_phone: "0908235279",
          to_address: "123 Street Address",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify stock was reduced
      const updatedItem = await db.Item.findByPk(item.id);
      expect(updatedItem.stock).toBe(4);

      // Verify transaction was created
      const transaction = await db.Transaction.findOne({
        where: { item_id: item.id },
      });
      expect(transaction).toBeDefined();
      expect(transaction.buyer_id).toBe(user.id);
    });

    it("should fail to purchase if quantity exceeds available stock", async () => {
      const res = await request(app)
        .post(`/api/items/purchase/${item.id}`)
        .set(authHeaders)
        .send({
          name: "Purchase Item",
          quantity: 10,
          receiver_information_id: receiverInfo.id,
          to_name: "Receiver Name",
          to_phone: "0908235279",
          to_address: "123 Street Address",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
