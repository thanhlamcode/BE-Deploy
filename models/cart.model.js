import mongoose from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);
const cartSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
    },
    cartItems: [
      {
        spec: { type: mongoose.Schema.Types.ObjectId, ref: "Specification" },
        quantity: {
          default: 1,
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema, "cart");
export default Cart;
