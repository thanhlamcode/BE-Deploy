import { Router } from "express";
import carouselController from "../../controllers/admin/carosel.controller.js";
import multer from "multer";
import uploadToDrive from "../../middleware/uploadToDrive.js";

// Cấu hình multer để lưu file tạm
const upload = multer({ dest: "/tmp" }); // Thư mục tạm thời trong môi trường serverless

const carouselRouter = Router();

// Xem
carouselRouter.get("/", carouselController.showCarousel);

// Xóa
carouselRouter.delete("/:id", carouselController.delCarousel);

// Thêm
carouselRouter.post(
  "/",
  upload.array("files", 1),
  uploadToDrive,
  carouselController.addCarousel
);

// Cập nhật
carouselRouter.patch(
  "/:id",
  upload.array("files", 1),
  uploadToDrive,
  carouselController.updateCarousel
);

export default carouselRouter;
