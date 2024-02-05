const request = require("supertest");
const express = require("express");
const userRouter = require("../routes/user.routes");
const { Users } = require("../models");

const app = express();
app.use(express.json());
app.use(userRouter); // Sesuaikan dengan prefix URL yang digunakan pada router

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
        password: "password",
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
      expect(response.body.message).toEqual('Email Veerified 🎉🎉🎉')
    });
  });
});
