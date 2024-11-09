import { Router } from "express";

import * as controller from "../../controllers/client/seen.controller.js";

const router = Router();

router.post("/add", controller.add);
router.get("/:userId", controller.getSeenProducts);

export default router;
