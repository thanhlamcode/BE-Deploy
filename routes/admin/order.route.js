import { Router } from "express";
import * as controller from "../../controllers/admin/order.controller.js";

const router = Router();

router.get("/", controller.index);
router.get("/user/:userId", controller.orderOfUser);
router.get("/detail/:orderId", controller.detail);
router.patch("/edit/:orderId", controller.edit);
router.delete("/:orderId", controller.deleteOrder);
router.get("/search", controller.search);
router.get("/statistic", controller.statistic);
router.get("/statistic-revenue", controller.statisticRevenue);

export default router;
