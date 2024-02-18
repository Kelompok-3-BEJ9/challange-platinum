const request = require("supertest");
const express = require("express");
const userRouter = require("../routes/user.routes");
const itemRouter = require("../routes/item.routes");
const orderRouter = require("../routes/order.routes");
const { Users } = require("../models");
const path = require('path');

const app = express();
app.use(express.json());
app.use(userRouter); // Sesuaikan dengan prefix URL yang digunakan pada router
app.use(itemRouter);
app.use(orderRouter); // Sesuaikan dengan prefix URL yang digunakan pada router

describe("Router Test", () => {
  describe("Auth Router Tests", () => {
    describe("Register Route Test ", () => {
      test("Invalid Format Email in Register", async () => {
        const response = await request(app).post("/register/v1").send({
          // Kirim data yang sesuai untuk registrasi
          first_name: "testuser",
          last_name: "testuser",
          email: "invalidemail",
          password: "123",
          phone: "0923892390",
          address: "bali",
          city: "badung",
          postal_code: "1234",
          country_code: "idn",
        });
        expect(response.statusCode).toBe(400);
      });
      test("Email Or Password Blank", async () => {
        const response = await request(app).post("/register/v1").send({
          // Kirim data yang sesuai untuk registrasi
          first_name: "testuser",
          last_name: "testuser",
          email: "",
          password: "",
          phone: "0923892390",
          address: "bali",
          city: "badung",
          postal_code: "1234",
          country_code: "idn",
        });
        expect(response.statusCode).toBe(400);
      });
      test("Success Register and Cek Email for Verify", async () => {
        const response = await request(app).post("/register/v1").send({
          // Kirim data yang sesuai untuk registrasi
          first_name: "testuser",
          last_name: "testuser",
          email: "ksuryasedana@gmail.com",
          password: "123",
          phone: "0923892390",
          is_admin: true, //for admin only
          address: "bali",
          city: "badung",
          postal_code: "1234",
          country_code: "idn",
        });
        expect(response.statusCode).toBe(200);
      });
      test("Email Already In System", async () => {
        const response = await request(app).post("/register/v1").send({
          // Kirim data yang sesuai untuk registrasi
          first_name: "testuser",
          last_name: "testuser",
          email: "ksuryasedana@gmail.com",
          password: "123",
          phone: "0923892390",
          address: "bali",
          city: "badung",
          postal_code: "1234",
          country_code: "idn",
        });
        expect(response.statusCode).toBe(409);
      });
      test("Verify Success", async () => {
        const user = await Users.findOne({
          where: {
            email: "ksuryasedana@gmail.com",
          },
        });
        const response = await request(app).get(
          `/verify/v1?token=${user.token_verify}`
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Email Veerified 🎉🎉🎉");
      });
    });
    describe("Login Route Test", () => {
      test("Email Not Found", async () => {
        const response = await request(app).post("/login/v1").send({
          email: "k@gmail.com",
          password: "password",
        });
        expect(response.statusCode).toBe(404);
      });
      test("Password Wrong", async () => {
        const response = await request(app).post("/login/v1").send({
          email: "ksuryasedana@gmail.com",
          password: "wrongpassword",
        });
        expect(response.statusCode).toBe(401);
      });
      test("Login Success", async () => {
        const response = await request(app).post("/login/v1").send({
          email: "ksuryasedana@gmail.com",
          password: "123",
        });
        expect(response.statusCode).toBe(200);
      });
    });
  });
 describe('Item Endpoint Test', () => {
  describe("Testing Create Item endpoint", () => {
    test("should upload file successfully to Cloudinary and Databse", async () => {
      const filePath = path.join(__dirname, "test.png");

      const response = await request(app)
        .post("/create/item/v1")
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
    test('should return error if file is not attached', async () => {
      // jika file tidak di attach
      const filePath = undefined;
      const response = await request(app)
        .post("/create/item/v1")
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
    test('should return error if file is not an image', async () => {
      // jika file bukan gambar
      const filePath = path.join(__dirname, "test.txt");
      const response = await request(app)
        .post("/create/item/v1")
        .attach("item_image", filePath)
        .field({
          item_name: "Test Item",
          item_price: 100,
          item_stock: 10,
          item_description: "Test description",
        });

      // Memeriksa bahwa respons dari endpoint adalah seperti yang diharapkan
      expect(response.statusCode).toBe(400);
    })
    test('should return error if item name and price is empty', async () => {
      // jika item name dan price kosong
      const filePath = path.join(__dirname, "test.png");
      const response = await request(app)
        .post("/create/item/v1")
        .attach("item_image", filePath)
        .field({
          item_name: "",
          item_price: "",
          item_stock: 10,
          item_description: "Test description",
        });

      // Memeriksa bahwa respons dari endpoint adalah seperti yang diharapkan
      expect(response.statusCode).toBe(400);
    })
  });
 });
});
