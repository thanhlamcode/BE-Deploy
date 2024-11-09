import { Router } from "express";

import * as controller from "../../controllers/client/cart.controller.js";
import cartController from "../../controllers/client/cart.controller.js";

const router = Router();

router.post("/add", controller.add);
router.patch("/delete", controller.deleteProduct);
router.get("/showCart/:userId", controller.showCart);
router.patch("/my-cart/:id", cartController.updateCart);

export default router;
