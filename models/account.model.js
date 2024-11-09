import mongoose from "mongoose";

// Định nghĩa schema cho ACCOUNT
const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Đảm bảo username không bị trùng lặp
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Đảm bảo email không trùng
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"], // Kiểm tra định dạng email
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10,15}$/, "Số điện thoại không hợp lệ"], // Kiểm tra định dạng số điện thoại
    },
    dateOfBirth: {
      type: Date,
    },
    accountStatus: {
      type: String,
      required: true,
      enum: ["active", "inactive"], // Trạng thái tài khoản có thể là 3 giá trị này
      default: "active", // Giá trị mặc định
    },
    accountCode: {
      type: String,
      required: true,
      unique: true, // Đảm bảo mã tài khoản là duy nhất
      trim: true,
    },
    accountRole: {
      type: String,
      required: true,
      enum: ["admin", "client"],
      default: "client",
    },
    // Mảng địa chỉ, mỗi phần tử là một ObjectId tham chiếu đến Address model
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address", // Tham chiếu đến model Address
      },
    ],
  },
  { timestamps: true }
); // Tự động thêm createdAt và updatedAt

// Tạo model từ schema
const AccountModel =
  mongoose.model.account || mongoose.model("Account", accountSchema);

export default AccountModel;
