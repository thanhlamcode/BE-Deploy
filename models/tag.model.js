import mongoose from "mongoose";

// Định nghĩa schema cho Tag
const tagSchema = new mongoose.Schema(
  {
    tagCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    tagName: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Tạo model Category từ schema
const Tag = mongoose.model("Tag", tagSchema, "tag");

export default Tag;
