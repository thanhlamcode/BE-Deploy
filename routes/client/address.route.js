import { Router } from "express";

import * as controller from "../../controllers/client/address.controller.js";

const router = Router();

router.get("/:accountId", controller.index);
router.post("/add", controller.post);
router.patch("/edit/:id", controller.edit);
router.delete("/delete/:id", controller.deleteAddress);

export default router;
