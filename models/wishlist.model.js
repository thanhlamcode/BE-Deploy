import mongoose from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);

const wishListSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
});

const wishList =
  mongoose.model.wishlist ||
  mongoose.model("wishlist", wishListSchema, "wishlists");
export default wishList;
