import Order from "../../models/order.model.js";
import Cart from "../../models/cart.model.js";
import {
  calculateDiscountAmount,
  calculateItemsTotal,
  createOrUpdateCart,
} from "../../helpers/order.helper.js";

// [GET] /client/order/user/:id
export const index = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.find({ userId: id })
      .populate({
        path: "address",
      })
      .populate({
        path: "voucher",
      })
      .populate({
        path: "cart",
        populate: {
          path: "cartItems",
          populate: {
            path: "spec",
            populate: {
              path: "products",
            },
          },
        },
      });

    res.json(order);
  } catch (error) {
    res.status(400).json(false);
  }
};

// [POST] /client/order/add
export const add = async (req, res) => {
  try {
    const {
      userId,
      cart,
      voucher = [],
      shippingCost = 0,
      ...orderData
    } = req.body;

    // Create or update the cart and get the new cart
    const newCart = await createOrUpdateCart(userId, cart);
    orderData.cart = newCart._id;

    // Populate spec in cart items to retrieve price and discountPercentage
    await Cart.populate(cart, {
      path: "cartItems.spec",
      select: "price discountPercentage",
    });

    // Calculate items total
    const itemsTotal = calculateItemsTotal(cart);

    // Calculate discount amount from vouchers
    const discountAmount = await calculateDiscountAmount(voucher, itemsTotal);

    // Calculate total amount
    const totalAmount = itemsTotal - discountAmount + shippingCost;

    // Assign calculated values to orderData
    orderData.totalAmount = totalAmount;
    orderData.discountAmount = discountAmount;
    orderData.shippingCost = shippingCost;
    orderData.userId = userId;
    orderData.voucher = voucher;

    // Create new order and save to database
    const newOrder = new Order(orderData);
    await newOrder.save();

    // Populate `spec`, `voucher`, and other fields in response
    const populatedOrder = await Order.findById(newOrder._id)
      .populate({
        path: "cart",
        populate: {
          path: "cartItems.spec",
          select: "price discountPercentage",
        },
      })
      .populate("voucher address");

    res.json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Lỗi khi tạo đơn hàng" });
  }
};

// [PATCH] /client/order/edit/:idOrder
export const edit = async (req, res) => {
  try {
    const orderId = req.params.idOrder;

    const { address, voucher } = req.body;

    const updateData = {};
    if (address) updateData.address = address;
    if (voucher) updateData.voucher = voucher;

    // Cập nhật đơn hàng với dữ liệu đã kiểm tra
    const record = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    if (!record) {
      return res.status(404).json(false);
    }

    res.json(record);
  } catch (error) {
    res.status(400).json(false);
  }
};

// [GET] /client/order/edit/:idOrder
export const detail = async (req, res) => {
  try {
    const orderId = req.params.orderID;

    console.log(orderId);

    const record = await Order.findOne({ _id: orderId })
      .populate({
        path: "address",
      })
      .populate({
        path: "voucher",
      })
      .populate({
        path: "cart",
        populate: {
          path: "cartItems",
          populate: {
            path: "spec",
            populate: {
              path: "products",
            },
          },
        },
      });

    res.json(record);
  } catch (error) {
    res.status(400).json(false);
  }
};

// [DELETE] /client/order/edit/:idOrder
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderID;

    const record = await Order.findOne({ _id: orderId });

    if (!record) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (record.processStatus === "pending") {
      await Order.deleteOne({ _id: orderId });
      return res.json(true);
    } else {
      return res.status(400).json(false);
    }
  } catch (error) {
    res.status(400).json(false);
  }
};
