import mongoose from "mongoose";

// Định nghĩa schema cho voucher
const voucherSchema = new mongoose.Schema(
  {
    voucherCode: {
      type: String,
      require: true,
    },
    voucherName: {
      type: String,
      required: true,
    },
    discountPercentage: Number,
    description: String,
    fixedAmount: Number,
    clients: [
      {
        clientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "account",
        },
        usageLimitPerCustomer: {
          type: Number,
          default: 1,
        },
      },
    ],
    expiringDate: Date,
  },
  {
    timestamps: true,
  }
);

const Voucher = mongoose.model("Voucher", voucherSchema, "voucher");

export default Voucher;
