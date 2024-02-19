const app = require('../app')
const request = require("supertest");
const path = require('path');
const { dummyToken } = require("../utils/dummyToken");
const token = `Bearer ${dummyToken}`;


describe("Item Endpoint Test", () => {
  describe("Testing Create Item endpoint", () => {
    test("should upload file successfully to Cloudinary and Databse", async () => {
      const filePath = path.join(__dirname, "test.png");

      const response = await request(app)
        .post("/create/item/v1")
        .set("Authorization", token)
        .attach("item_image", filePath)
        .field({
          item_name: "Test Item",
          item_price: 100,
          item_stock: 10,
          item_description: "Test description",
        });

      // Memeriksa bahwa respons dari endpoint adalah seperti yang diharapkan
      expect(response.statusCode).toBe(201);
    });
    test("should return error if file is not attached", async () => {
      // jika file tidak di attach
      const filePath = undefined;
      const response = await request(app)
        .post("/create/item/v1")
        .set("Authorization", token)
        .attach("item_image", filePath)
        .field({
          item_name: "Test Item",
          item_price: 100,
          item_stock: 10,
          item_description: "Test description",
        });

      // Memeriksa bahwa respons dari endpoint adalah seperti yang diharapkan
      expect(response.statusCode).toBe(400);
    });
    test("should return error if file is not an image", async () => {
      // jika file bukan gambar
      const filePath = path.join(__dirname, "test.txt");
      const response = await request(app)
        .post("/create/item/v1")
        .set("Authorization", token)
        .attach("item_image", filePath)
        .field({
          item_name: "Test Item",
          item_price: 100,
          item_stock: 10,
          item_description: "Test description",
        });

      // Memeriksa bahwa respons dari endpoint adalah seperti yang diharapkan
      expect(response.statusCode).toBe(400);
    });
    test("should return error if item name and price is empty", async () => {
      // jika item name dan price kosong
      const filePath = path.join(__dirname, "test.png");
      const response = await request(app)
        .post("/create/item/v1")
        .set("Authorization", token)
        .attach("item_image", filePath)
        .field({
          item_name: "",
          item_price: "",
          item_stock: 10,
          item_description: "Test description",
        });

      // Memeriksa bahwa respons dari endpoint adalah seperti yang diharapkan
      expect(response.statusCode).toBe(400);
    });
  });
});