import mongoose from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    productCode: String,
    productName: String,
    description: String,
    productStatus: String,
    imageURLs: {
      type: [String],
    },
    slug: { type: String, slug: "productName" },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    specs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specification",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    relativeProduct: [
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

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema); // Tên model là "Product"
export default Product;
