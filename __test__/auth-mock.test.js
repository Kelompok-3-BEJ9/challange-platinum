const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const { Users, User_Details } = require("../models");
const { register, login } = require("../controller/auth");
const mockUserId = 1;
const mockUser = {
    first_name: "Cek",
    last_name: "123",
    email: "cek@mail.com",
    password: "123",
    phone: "08123456789",
    address: "merdeka street 19",
    city: "Bandung",
    postal_code: "40123",
    country_code: "Indonesia",
    token_verify: null,
    verify: true,
};

const hashedPassword = "$2b$10$DqpjbKO.hA8IRcNKDBmPWOSisXNzn4Xte8MuXa7LpwNd/u9qIOi2S";
const randomToken = "9f6fb21a-9d71-4b7d-92e7-fdef4abf744a";

let mockCreateUser = {
    first_name: mockUser.first_name,
    last_name: mockUser.last_name,
    email: mockUser.email,
    phone: mockUser.phone,
    password: hashedPassword,
    token_verify: randomToken,
};
let mockUserDetail = {
    user_id: mockUserId,
    address: mockUser.address,
    city: mockUser.city,
    postal_code: mockUser.postal_code,
    country_code: mockUser.country_code,
};
jest.mock("../models", () => {
    const SequelizeMock = require("sequelize-mock");
    const dbMock = new SequelizeMock();
    const UsersMock = dbMock.define("user", {});
    const User_DetailsMock = dbMock.define("user_detail", {});

    return { Users: UsersMock, User_Details: User_DetailsMock };
});

const mockError = new Error("Mock Internal Server Error");

// **INTEGRATION TEST */
describe("Integration test with mocking at endpoint register and login", () => {
    //**POST REGISTER */

    describe("POST /register/v1,", () => {
        Users.findOne = jest.fn().mockResolvedValue(null);
        Users.create = jest.fn().mockResolvedValue({
            toJSON: () => mockCreateUser,
        });

        User_Details.create = jest.fn().mockResolvedValue({
            toJSON: () => mockUserDetail,
        });
        it("should create new user successfully", async () => {
            const response = await request(app).post("/register/v1").send(mockUser);
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                message: "Cek Your Email For Verify!!",
                status_code: 200,
                data: {
                    name: mockUser.first_name,
                    email: mockUser.email,
                },
            });
        });

        it("should return 400 when invalid email already exist", async () => {
            Users.findOne = jest.fn().mockResolvedValueOnce({
                toJSON: () => mockUser.email,
            });
            const response = await request(app).post("/register/v1").send(mockUser);
            expect(response.status).toBe(409);
            expect(response.body).toMatchObject({
                message: "Email Already Exist!",
                status_code: 409,
                data: null,
            });
        });

        it("should return 400 when password is null", async () => {
            mockUser.password = null;
            const response = await request(app).post("/register/v1").send(mockUser);
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "Input Email & Password",
                status_code: 400,
                data: null,
            });
        });

        it("should return 400 when email is null", async () => {
            mockUser.email = null;
            mockUser.password = "123";
            const response = await request(app).post("/register/v1").send(mockUser);
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "Input Email & Password",
                status_code: 400,
                data: null,
            });
        });

        it("should return 400 when invalid email format", async () => {
            mockUser.email = "c";
            const response = await request(app).post("/register/v1").send(mockUser);
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "Invalid email format",
                status_code: 400,
                data: null,
            });
            mockUser.email = "cek@mail.com"; //changing back the mockUser for the next test
        });
        it("should return 500 Internal Server Error", async () => {
            Users.create = jest.fn().mockRejectedValueOnce(mockError);
            const response = await request(app).post("/register/v1").send(mockUser);
            expect(response.status).toBe(500);
        });
    });
    //**POST LOGIN */
    describe("POST /login/v1,", () => {
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
        it("should login successfully", async () => {
            Users.findOne = jest.fn().mockResolvedValueOnce({
                toJSON: () => mockUser.email,
            });
            const response = await request(app)
                .post("/login/v1")
                .send({ email: mockUser.email, password: mockUser.password });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message");
            expect(response.body).toHaveProperty("status_code");
            expect(response.body).toHaveProperty("data");
        });

        it("should return 401 Incorrect Password! 👎", async () => {
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
            Users.findOne = jest.fn().mockResolvedValueOnce(mockUser);
            const response = await request(app)
                .post("/login/v1")
                .send({ email: mockUser.email, password: "wrong_password" });
            expect(response.status).toBe(401);
            expect(response.body).toMatchObject({
                message: "Incorrect Password! 👎",
                status_code: 401,
                data: null,
            });
        });

        it("should return 404 Email Not Found!", async () => {
            const response = await request(app)
                .post("/login/v1")
                .send({ email: "wrongEmail", password: mockUser.password });
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "Email Not Found!",
                status_code: 404,
                data: null,
            });
        });
        it("should return 400 Please Verify Your Email!", async () => {
            mockUser.verify = false;
            Users.findOne = jest.fn().mockResolvedValueOnce(mockUser);
            const response = await request(app)
                .post("/login/v1")
                .send({ email: mockUser.email, password: mockUser.password });
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "Please Verify Your Email!",
                status_code: 400,
                data: null,
            });
        });

        it("should return 500 Internal Server Error", async () => {
            Users.findOne = jest.fn().mockRejectedValueOnce(mockError);
            const response = await request(app)
                .post("/login/v1")
                .send({ email: mockUser.email, password: mockUser.password });
            expect(response.status).toBe(500);
        });
    });
    Users.create.mockReset();
    User_Details.create.mockReset();
});

// **MOCKING FOR UNIT TEST ONLY */
const mockRequest = (body = {}, params = {}, query = {}) => {
    return {
        body: body,
        params: params,
        query: query,
    };
};

const mockResponse = () => {
    const res = {};

    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    return res;
};

const next = jest.fn();

//**UNIT TEST */
describe("Unit tests for endpoint handlers", () => {
    describe("register()", () => {
        Users.findOne = jest.fn().mockResolvedValue(null);
        Users.create = jest.fn().mockResolvedValue({
            toJSON: () => mockCreateUser,
        });

        User_Details.create = jest.fn().mockResolvedValue({
            toJSON: () => mockUserDetail,
        });

        const req = mockRequest(mockUser);
        const res = mockResponse();

        it("should create new user successfully", async () => {
            Users.findOne = jest.fn().mockResolvedValue(null);
            Users.create = jest.fn().mockResolvedValue({
                toJSON: () => mockCreateUser,
            });

            User_Details.create = jest.fn().mockResolvedValue({
                toJSON: () => mockUserDetail,
            });
            await register(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    message: "Cek Your Email For Verify!!",
                    status_code: 200,
                    data: {
                        name: mockUser.first_name,
                        email: mockUser.email,
                    },
                });
            });
        });

        it("should return 400 when invalid email already exist", async () => {
            Users.findOne = jest.fn().mockResolvedValueOnce(mockUser.email);
            await register(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(409);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Email Already Exist!",
                    status_code: 409,
                    data: null,
                });
            });
        });

        it("should return should return 400 when password is null", async () => {
            mockUser.password = null;
            await register(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Input Email & Password",
                    status_code: 400,
                    data: null,
                });
            });
        });

        it("should return 400 when email is null", async () => {
            mockUser.password = "123";
            mockUser.email = null;
            await register(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Input Email & Password",
                    status_code: 400,
                    data: null,
                });
            });
        });

        it("should return 400 when invalid email format", async () => {
            mockUser.email = "c";
            await register(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Invalid email format",
                    status_code: 400,
                    data: null,
                });
            });
        });
    });

    describe("login()", () => {
        const res = mockResponse();

        it("should login successfully", async () => {
            const req = mockRequest({ email: mockUser.email, password: mockUser.password });
            Users.findOne.mockResolvedValueOnce(mockUser.email);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

            await login(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(200);
            });
        });

        it("should return 401 Incorrect Password! 👎", async () => {
            const req = mockRequest({ email: mockUser.email, password: "wrong_password" });
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
            Users.findOne = jest.fn().mockResolvedValueOnce(mockUser.email);

            await login(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(401);
            });
        });

        it("should return 404 Email Not Found!", async () => {
            const req = mockRequest({ email: "wrong_email", password: mockUser.password });

            await login(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(404);
            });
        });

        it("should return 400 Please Verify Your Email!", async () => {
            mockUser.verify = false;
            const req = mockRequest({ email: mockUser.email, password: mockUser.password });
            Users.findOne = jest.fn().mockResolvedValueOnce(mockUser);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

            await login(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(404);
            });
        });
    });
});
