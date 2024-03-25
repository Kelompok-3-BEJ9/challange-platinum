const request = require("supertest");
const app = require("../app");
const { sequelize, Items, Order, Order_items } = require("../models");
const { generateJwtToken } = require("../modules/jwt");
const { createOrder, orderSuccess, getOrderDetails } = require("../controller/order");

//**MOCKING */
const mockUser = {
    id: 1,
    name: "Cek",
    email: "cek@mail.com",
    is_admin: true,
};
const mockToken = generateJwtToken(mockUser);

const mockOrder = {
    id: "1f12c931-ca43-4dc1-89e0-95c8684968ab",
    user_id: 1,
    total_order_price: "60000000",
    status_order: "Pending",
    date_order_placed: "2024-03-07 13:18:51",
    date_order_paid: null,
};

const item = {
    id: 1,
    item_name: "item-1",
    item_price: 50,
    item_image: "image1.jpg",
    item_stock: 10,
    item_description: "item1-desc",
};

const orderResult = {
    id: 1,
    items: {
        item_name: item.item_name,
        item_price: item.item_price,
        item_image: item.item_image,
        order_items: { quantity: 2, total_amount: 200 },
    },
};

//**MOCKING DATABASES */
jest.mock("../models", () => {
    const SequelizeMock = require("sequelize-mock");
    const dbMock = new SequelizeMock();

    const OrderMock = dbMock.define("order", {});
    const ItemsMock = dbMock.define("items", {});
    const TransactionMock = dbMock.transaction();

    //**createOrder's transaction mocking */
    TransactionMock.commit = jest.fn().mockResolvedValue();
    TransactionMock.rollback = jest.fn().mockResolvedValue();

    dbMock.transaction = jest.fn().mockImplementation(() => {
        return {
            commit: TransactionMock.commit,
            rollback: TransactionMock.rollback,
        };
    });

    return {
        Order: OrderMock,
        Items: ItemsMock,
        sequelize: dbMock,
        transaction: TransactionMock,
    };
});

//for mocking createOrder()
const orderAddItems = {
    user_id: 1,
    status_order: "Pending",
    total_order_price: null,
    quantity: null,
    total_amount: null,
    addItems: jest.fn().mockImplementation(async function () {
        (this.quantity = 2),
            (this.total_amount = item.item_price * this.quantity),
            (this.total_order_price = this.total_amount * 1);
        return this;
    }),
    toJSON: function () {
        return {
            user_id: this.user_id,
            status_order: this.status_order,
            total_order_price: this.total_order_price,
            quantity: this.quantity,
            total_amount: this.total_amount,
        };
    },
};

const updatedStock = {
    id: item.id,
    item_name: item.item_name,
    item_price: item.item_price,
    item_image: item.item_image,
    item_stock: item.item_stock,
    item_description: item.item_description,
    update: jest.fn().mockImplementation(async function () {
        this.item_stock -= 2;
        return this;
    }),
    toJSON: function () {
        return {
            id: item.id,
            item_name: item.item_name,
            item_price: item.item_price,
            item_image: item.item_image,
            item_stock: item.item_stock,
            item_description: item.item_description,
        };
    },
};

//for mocking orderSuccess()
const mockOrderInstance = {
    id: "1f12c931-ca43-4dc1-89e0-95c8684968ab",
    user_id: 1,
    total_order_price: "60000000",
    status_order: "Pending",
    date_order_placed: "2024-03-07 13:18:51",
    date_order_paid: "2024-03-07 14:9:51",
    save: jest.fn().mockImplementation(async function () {
        this.status_order = "Success";
        this.date_order_paid = "2024-03-07 14:9:51";
        return this;
    }),
    toJSON: function () {
        return {
            id: this.id,
            user_id: this.user_id,
            total_order_price: this.total_order_price,
            status_order: this.status_order,
            date_order_placed: this.date_order_placed,
            date_order_paid: this.date_order_paid,
        };
    },
};
const mockError = new Error("Mock Internal Server Error");

// const responseOrder = {
//     id: 1,
//     item_name: "item-1",
//     item_price: 50,
//     item_image: "image1.jpg",
//     item_stock: 10,
//     item_description: "item1-desc",
//     quantity: null,
//     total_amount: null,
//     total_order_price: null,
//     addItems: jest.fn().mockImplementation(async function () {
//         (this.quantity = 2),
//             (this.total_amount = this.item_price * this.quantity),
//             (this.total_order_price = this.total_amount * 1);
//         return this;
//     }),
//     toJSON: function () {
//         return {
//             user_id: 1,
//             status_order: "Pending",
//             total_order_price: this.total_order_price,
//             items: {
//                 item_name: this.item_name,
//                 item_price: this.item_name,
//                 item_image: this.item_name,
//                 order_items: {
//                     quantity: this.quantity,
//                     total_amount: this.total_amount,
//                 },
//             },
//         };
//     },
// };

//**INTEGRATION TEST */
describe("Integration test with mocking at order's router", () => {
    //**POST METHOD */
    describe("POST /order/v1 createOrder", () => {
        it("should create an order successfully", async () => {
            Items.findByPk = jest.fn().mockResolvedValueOnce(updatedStock);
            Order.create = jest.fn().mockResolvedValueOnce(orderAddItems);
            Order.findByPk = jest.fn().mockResolvedValueOnce(orderResult);
            const response = await request(app)
                .post("/order/v1")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ item_id: item.id, quantity: 2 });

            expect(sequelize.transaction().commit).toHaveBeenCalled();
            expect(sequelize.transaction().rollback).not.toHaveBeenCalled();
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                message: "Order created successfully",
                status_code: 201,
                data: orderResult,
            });
        });

        it("should return 400 invalid quantity", async () => {
            const response = await request(app)
                .post("/order/v1")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ item_id: item.id, quantity: 0 });

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "Please input a valid quantity!",
                status_code: 400,
                data: null,
            });
        });

        it("should return 404 Item Not Found", async () => {
            const response = await request(app)
                .post("/order/v1")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ item_id: 2, quantity: 1 }); //there isn't item_id = 2

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "Item Not Found",
                status_code: 404,
                data: null,
            });
        });

        it("should return 400 Item out of stock", async () => {
            Items.findByPk = jest.fn().mockResolvedValueOnce(updatedStock);
            const response = await request(app)
                .post("/order/v1")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ item_id: item.id, quantity: 200 });

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({
                message: "Item out of stock",
                status_code: 400,
                data: null,
            });
        });

        it("should return 401 Unauthorized", async () => {
            const response = await request(app)
                .post("/order/v1")
                .send({ item_id: item.id, quantity: 200 });

            expect(response.status).toBe(401);
        });

        it("should return 500 Internal Server Error", async () => {
            Items.findByPk = jest.fn().mockRejectedValueOnce(mockError);

            const response = await request(app)
                .post("/order/v1")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ item_id: 3, quantity: 2 });
            expect(response.status).toBe(500);
        });
    });

    //**PUT METHOD */
    describe("PUT /update/order/v1 orderSucccess", () => {
        it("return status 200 and `Order Update Success!`", async () => {
            Order.findOne = jest.fn().mockResolvedValueOnce(mockOrderInstance);
            const response = await request(app)
                .put("/update/order/v1")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ order_id: `${mockOrder.id}` });

            mockOrder.status_order = "Success";
            mockOrder.date_order_paid = "2024-03-07 14:9:51";
            expect(response.status).toBe(200);
            expect(response).toHaveProperty("status");
            expect(response.body).toMatchObject({
                message: "Order Update Success!",
                status_code: 200,
                data: mockOrder,
            });
        });

        it("return status 404 and `Order Not Found!`", async () => {
            const response = await request(app)
                .put("/update/order/v1")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ order_id: 2 }); //this order_id doesn't exist
            expect(response.status).toBe(404);
            expect(response).toHaveProperty("status");
            expect(response.body).toMatchObject({
                message: "Order Not Found!",
                status_code: 404,
                data: null,
            });
        });

        it("return status 401 Unauthorized", async () => {
            const response = await request(app)
                .put("/update/order/v1") //not including authorization
                .send({ order_id: `${mockOrder.id}` });
            expect(response.status).toBe(401);
            expect(response).toHaveProperty("status");
        });

        it("should return 500 Internal Server Error", async () => {
            Order.findOne = jest.fn().mockRejectedValueOnce(mockError);
            const response = await request(app)
                .put("/update/order/v1")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
        });
    });

    //**GET METHOD */
    describe("GET /get/order/v1", () => {
        const order_id = 1;

        it("should return order details with items", async () => {
            Order.findByPk = jest.fn().mockResolvedValueOnce(orderResult);
            const response = await request(app)
                .get(`/get/order/v1?order_id=${order_id}`)
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response).toHaveProperty("status");
            expect(response.body).toMatchObject({
                message: "Get Order Success!",
                status_code: 200,
                data: orderResult,
            });
        });

        it("should return 404 if order not found", async () => {
            Order.findByPk = jest.fn().mockResolvedValueOnce(null);
            const response = await request(app)
                .get(`/get/order/v1?order_id=${order_id}`)
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response).toHaveProperty("status");
            expect(response.body).toMatchObject({
                message: "Order Not Found!",
                status_code: 404,
            });
        });

        it("should return 401 Unauthorized", async () => {
            const response = await request(app).get(`/get/order/v1?order_id=${order_id}`);

            expect(response.status).toBe(401);
            expect(response).toHaveProperty("status");
        });
        it("should return 500 Internal Server Error", async () => {
            Order.findByPk = jest.fn().mockRejectedValueOnce(mockError);
            const response = await request(app)
                .get(`/get/order/v1?order_id=${order_id}`)
                .set("Authorization", `Bearer ${mockToken}`);
            console.log(response.body);
            expect(response.status).toBe(500);
        });
    });
});

//**MOCKING FOR UNIT TEST ONLY */
const mockRequest = (body = {}, params = {}, query = {}, user = {}) => {
    return {
        body: body,
        params: params,
        query: query,
        user: user,
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
describe("Unit tests for endpoint returnrs", () => {
    describe("createOrder()", () => {
        const res = mockResponse();

        it("should create new user successfully", async () => {
            const req = mockRequest({ item_id: 1, quantity: 2 }, null, null, {
                user_id: mockUser.id,
            });
            Items.findByPk = jest.fn().mockResolvedValueOnce(updatedStock);
            Order.create = jest.fn().mockResolvedValueOnce(orderAddItems);
            Order.findByPk = jest.fn().mockResolvedValueOnce(orderResult);

            await createOrder(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    message: "Order created successfully",
                    status_code: 201,
                    data: orderResult,
                });
            });
        });

        it("should return 400 invalid quantity", async () => {
            const req = mockRequest({ item_id: 1, quantity: 0 }, null, null, {
                user_id: mockUser.id,
            });
            Items.findByPk = jest.fn().mockResolvedValueOnce(updatedStock);
            Order.create = jest.fn().mockResolvedValueOnce(orderAddItems);
            Order.findByPk = jest.fn().mockResolvedValueOnce(orderResult);

            await createOrder(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Please input a valid quantity!",
                    status_code: 400,
                    data: expect.objectContaining({}),
                });
            });
        });

        it("should return 404 Item Not Found", async () => {
            const req = mockRequest({ item_id: 2, quantity: 2 }, null, null, {
                user_id: mockUser.id,
            }); //there isn't an item_id = 2
            Items.findByPk = jest.fn().mockResolvedValueOnce(null);
            Order.create = jest.fn().mockResolvedValueOnce(orderAddItems);
            Order.findByPk = jest.fn().mockResolvedValueOnce(orderResult);

            await createOrder(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Item Not Found",
                    status_code: 404,
                    data: expect.objectContaining({}),
                });
            });
        });

        it("should return 400 Item out of stock", async () => {
            const req = mockRequest({ item_id: 2, quantity: 200 }, null, null, {
                user_id: mockUser.id,
            });
            Items.findByPk = jest.fn().mockResolvedValueOnce(updatedStock);
            Order.create = jest.fn().mockResolvedValueOnce(orderAddItems);
            Order.findByPk = jest.fn().mockResolvedValueOnce(orderResult);

            await createOrder(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Item out of stock",
                    status_code: 400,
                    data: expect.objectContaining({}),
                });
            });
        });
    });

    describe("orderSuccess()", () => {
        const res = mockResponse();
        it("should update order successfully", async () => {
            const req = mockRequest({ id: mockOrder.id });
            Order.findOne = jest.fn().mockResolvedValueOnce(mockOrderInstance);

            await orderSuccess(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    message: "Order Update Success!",
                    status_code: 200,
                    data: expect.objectContaining(mockOrder),
                });
            });
        });

        it("should return 404 Order Not Found!", async () => {
            const req = mockRequest({ id: 5 });
            Order.findOne = jest.fn().mockResolvedValueOnce(null);

            await orderSuccess(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Order Not Found!",
                    status_code: 404,
                    data: expect.objectContaining({}),
                });
            });
        });
    });

    describe("getOrderDetails()", () => {
        const res = mockResponse();
        it("should update order successfully", async () => {
            const req = mockRequest({ order_id: mockOrder.id });
            Order.findByPk = jest.fn().mockResolvedValueOnce(orderResult);

            await getOrderDetails(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    message: "Get Order Success!",
                    status_code: 200,
                    data: expect.objectContaining(orderResult),
                });
            });
        });

        it("should return 404 Order Not Found!", async () => {
            const req = mockRequest({ order_id: 5 });
            Order.findByPk = jest.fn().mockResolvedValueOnce(null);

            await getOrderDetails(req, res, next).then(() => {
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: "Order Not Found!",
                    status_code: 404,
                    data: expect.objectContaining({}),
                });
            });
        });
    });
});
