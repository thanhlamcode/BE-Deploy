import { Router } from "express";
import * as controller from "../../controllers/admin/tag.controller.js";

const router = Router();

router.get("/", controller.index);
router.post("/add", controller.add);
router.patch("/edit/:id", controller.edit);
router.delete("/delete/:id", controller.deletetag);
router.get("/search", controller.search);

export default router;
