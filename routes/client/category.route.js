import { Router } from "express";

import * as controller from "../../controllers/client/category.controller.js";

const router = Router();

router.get("/", controller.index);
router.get("/search", controller.search);

export default router;
