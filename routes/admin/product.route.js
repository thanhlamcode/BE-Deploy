import { Router } from "express";
import * as controller from "../../controllers/admin/product.controller.js";
import multer from "multer";
import uploadToDrive from "../../middleware/uploadToDrive.js";

// Cấu hình multer để lưu file tạm vào /tmp
const upload = multer({ dest: "/tmp" }); // Thư mục tạm thời trong môi trường serverless

const router = Router();

router.get("/", controller.index);
router.get("/productDetail/:id", controller.detail);
router.post(
  "/postProduct",
  upload.array("files", 6),
  uploadToDrive,
  controller.postProduct
);
router.patch(
  "/editProduct/:id",
  upload.array("files", 6),
  uploadToDrive,
  controller.editProduct
);
router.delete("/deleteProduct/:id", controller.deleteProduct);
router.get("/search", controller.search);
router.get("/statistic-brand/:brandId", controller.statisticBrand);

export default router;
