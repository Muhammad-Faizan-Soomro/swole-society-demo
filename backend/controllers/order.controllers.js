import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      throw new ApiError(400, "no order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x.data._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient.data._id
      );

      if (!matchingItemFromDB) {
        throw new ApiError(
          400,
          `Product not found: ${itemFromClient.data._id}`
        );
      }

      return {
        ...itemFromClient,
        product: itemFromClient.data._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const finalOrder = [];

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    dbOrderItems.map((x) => {
      let tempData = {
        name: x.data.name,
        image: x.data.image,
        price: x.price,
        qty: x.qty,
        product: x.product,
      };
      finalOrder.push(tempData);
    });

    const order = await Order.create({
      orderItems: finalOrder,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await Order.findById(order._id);

    if (!createdOrder) {
      throw new ApiError(
        500,
        "can not create order due to some internal server error"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdOrder, "order created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    if (!orders) {
      throw new ApiError(
        500,
        "can not retrieve orders due to some internal server error"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, orders, "all orders retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
      throw new ApiError(
        500,
        "can not retrieve user orders due to some internal server error"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, orders, "all user orders retrieved successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    if (!totalOrders) {
      throw new ApiError(
        500,
        "can not count total orders due to some internal server error"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, totalOrders, "total orders retrieved successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const calculateTotalSales = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    if (!totalSales) {
      throw new ApiError(
        500,
        "can not count total sales due to some internal server error"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, totalSales, "total sales retrieved successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const calcualteTotalSalesByDate = asyncHandler(async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    if (!salesByDate) {
      throw new ApiError(
        500,
        "can not count total sales by date due to some internal server error"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          salesByDate,
          "total sales by date retrieved successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const findOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (!order) {
      throw new ApiError(
        500,
        "can not find order due to some internal server error"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, order, "order retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// const markOrderAsPaid = asyncHandler(async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       throw new ApiError(400, "can not find order");
//     }

//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.payer.email_address,
//     };

//     await order.save({ validateBeforeSave: false });

//     if (!order) {
//       throw new ApiError(
//         500,
//         "can not save order due to some internal server error"
//       );
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, order, "order marked as paid successfully"));
//   } catch (error) {
//     throw new ApiError(500, error.message);
//   }
// });

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ApiError(400, "can not find order");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    await order.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(
        new ApiResponse(200, order, "order marked as delivered successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  // markOrderAsPaid,
  markOrderAsDelivered,
};
