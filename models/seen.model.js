import mongoose from "mongoose";

// Định nghĩa schema cho Seen
const seenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Tham chiếu đến model Product
        required: true,
      },
    ],
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model từ schema
const SeenModel = mongoose.models.seen || mongoose.model("Seen", seenSchema);

export default SeenModel;
