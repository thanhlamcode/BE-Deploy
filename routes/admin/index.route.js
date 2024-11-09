import productRoutes from "./product.route.js";
import accountRoutes from "./account.route.js";
import categoryRoutes from "./category.route.js";
import tagRoutes from "./tag.route.js";
import specRoutes from "./specification.route.js";
import brandRoutes from "./brand.route.js";
import voucherRoutes from "./voucher.route.js";
import authRoutes from "./auth.route.js";
import orderRoutes from "./order.route.js";
import carouselRoutes from "./carousel.route.js";
import reviewRoutes from "./reviews.route.js";
import statsRoutes from "./stats.route.js";
import { isAdmin } from "../../middleware/authMiddleware.js";

export default (app) => {
  app.use("/product", productRoutes);
  app.use("/account", accountRoutes);
  app.use("/auth", authRoutes);
  app.use("/category", categoryRoutes);
  app.use("/tag", tagRoutes);
  app.use("/category", categoryRoutes);
  app.use("/spec", specRoutes);
  app.use("/brand", brandRoutes);
  app.use("/voucher", voucherRoutes);
  app.use("/order", orderRoutes);
  app.use("/carousel", carouselRoutes);
  app.use("/stats", statsRoutes);
};
