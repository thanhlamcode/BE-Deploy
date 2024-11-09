import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    accountId: String,
  },
  {
    timestamps: true, // Thêm thông tin thời gian tạo và cập nhật
  }
);

const Address =
  mongoose.models.Address ||
  mongoose.model("Address", addressSchema, "address");

export default Address;
