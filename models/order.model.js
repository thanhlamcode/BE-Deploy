import mongoose from "mongoose";

const orderScheme = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    processStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "bank_transfer"],
    },
    totalAmount: {
      type: Number,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    orderNote: {
      type: String,
      trim: true,
    },
    expectedReceiveTime: {
      type: Date,
    },
    receiveTime: {
      type: Date,
    },
    takeOrderTime: {
      type: Date,
    },
    payTime: {
      type: Date,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    voucher: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
      },
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderScheme);
export default Order;
