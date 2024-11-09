import mongoose, { Mongoose } from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);

const specificationSchema = new mongoose.Schema(
  {
    specCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    specifications: [
      {
        key: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SpecificationKey",
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    stockQuantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number, // Được sử dụng để đại diện cho số thập phân trong MongoDB
      required: true,
    },
    products: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Liên kết tới schema "product"
    },
    discountPercentage: Number,
  },
  {
    timestamps: true,
  }
);

const _Spec =
  mongoose.models.Specification ||
  mongoose.model("Specification", specificationSchema);
export default _Spec;
