const { sequelize } = require("../models/index");
const { SuccessResponse, ErrorResponse } = require("../utils/respons");
const { Users, Order, Items } = require("../models");

async function createOrder(req, res, next) {
  const transaction = await sequelize.transaction();

  try {
    const user_id = +req.params.user_id;
    const { item_id, quantity } = req.body;

    // Check if quantity is valid
    if (!quantity || quantity <= 0) {
      const response = new ErrorResponse("Please input a valid quantity!", 400);
      return res.status(400).json(response);
    }

    // Find User
    const findUser = await Users.findByPk(user_id, { transaction });
    if (!findUser) {
      return res.status(404).json(new ErrorResponse("User Not Found!", 404));
    }

    // Find Item
    const item = await Items.findByPk(item_id, { transaction });
    if (!item) {
      return res.status(404).json(new ErrorResponse("Item Not Found", 404));
    }

    // Check if item is out of stock
    if (item.item_stock === 0 || quantity > item.item_stock) {
      return res.status(400).json(new ErrorResponse("Item out of stock", 400));
    }

    // Calculate total order_price
    const total_amount = item.item_price * quantity;
    const total_order_price = total_amount * 1.1;

    // Create order
    const order = await Order.create(
      {
        user_id,
        status_order: "Pending",
        total_order_price,
      },
      { transaction }
    );

    // Update stock
    const updatedStock = item.item_stock - quantity;
    await item.update({ item_stock: updatedStock }, { transaction });

    // Add quantity and total amount to the response
    await order.addItems(item, {
      through: { quantity, total_amount },
      transaction,
    });

    // Response order
    const responseOrder = await Order.findByPk(order.id, {
      include: {
        model: Items,
        as: "items",
        attributes: ["item_name", "item_image","item_price"],
        through: {
          as: "order_items",
          attributes: { exclude: ["order_id", "item_id"] },
        },
      },
      transaction,
    });

    // Commit transaction
    await transaction.commit();

    const response = new SuccessResponse(
      "Order created successfully",
      201,
      responseOrder
    );

    return res.status(201).json(response);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}


async function orderSuccess(req, res, next) {
  try {
    const { order_id } = req.body;
    const updateOrder = await Order.findOne({ where: { id: order_id } });
    if (!updateOrder) {
      const response = new ErrorResponse("Order Not Found!", 404);
      return res.status(404).json(response);
    } else {
      updateOrder.status_order = "Success";

      await updateOrder.save();
      const response = new SuccessResponse(
        "Order Update Success!",
        200,
        updateOrder
      );
      res.status(200).json(response);
    }
  } catch (error) {
    next(error);
  }
}

async function getOrderDetails(req, res, next) {
  try {
    const { order_id } = req.body;

    // Dapatkan detail order beserta produknya
    const order = await Order.findByPk(order_id, {
      include: {
        model: Items,
        as: "items",
        attributes: ["item_name", "item_price", "item_image"],
        through: {
          as: "order_items",
          attributes: ["quantity", "total_amount"],
        },
      },
    });

    if (!order) {
      const response = new ErrorResponse("Order Not Found!", 404);
      return res.status(404).json(response);
    }
    const response = new SuccessResponse("Get Order Success!", 200, order);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = { createOrder, orderSuccess, getOrderDetails };
