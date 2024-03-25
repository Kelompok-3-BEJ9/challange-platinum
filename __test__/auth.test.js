const request = require("supertest");
const app = require("../app");
const { Users } = require("../models");

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
                const response = await request(app).get(`/verify/v1?token=${user.token_verify}`);

                expect(response.statusCode).toBe(200);
                expect(response.body.message).toEqual("Email Veerified 🎉🎉🎉");
            });
            // test.only("Internal Server Error 500", async () => {
            //     const response = await request(app).post("/register/v1");
            //     expect(response.statusCode).toBe(500);
            // });
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
});
