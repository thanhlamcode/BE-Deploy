import { Router } from "express";

import * as controller from "../../controllers/client/order.controller.js";

const router = Router();

router.get("/user/:id", controller.index);
router.post("/add", controller.add);
router.patch("/edit/:idOrder", controller.edit);
router.get("/detail/:orderID", controller.detail);
router.delete("/delete/:orderID", controller.deleteOrder);

export default router;
