import voucherRoutes from "./voucher.route.js";
import cartRoutes from "./cart.route.js";
import brandRoutes from "./brand.route.js";
import addressRoutes from "./address.route.js";
import seenRoutes from "./seen.route.js";
import categoryRoutes from "./category.route.js";
import productRoutes from "./product.route.js";
import wishListRoutes from "./wishList.route.js";
import accountRoutes from "./account.route.js";
import orderRoutes from "./order.route.js";
import reviewRoutes from "./reviews.route.js";
import { authenticateJWT } from "../../middleware/authMiddleware.js";

export default (app) => {
  app.use("/client/voucher", voucherRoutes);
  app.use("/client/cart", cartRoutes);
  app.use("/cart", cartRoutes);
  app.use("/client/brand", brandRoutes);
  app.use("/client/address", addressRoutes);
  app.use("/client/seen", seenRoutes);
  app.use("/client/category", categoryRoutes);
  app.use("/client/product", productRoutes);
  app.use("/client/wishList", wishListRoutes);
  app.use("/client/account", accountRoutes);
  app.use("/client/order", orderRoutes);
  app.use("/client/reviews", reviewRoutes);
};
