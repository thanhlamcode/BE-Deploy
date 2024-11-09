import { Router } from "express";
import reviewController from "../../controllers/admin/review.controller.js";

const reviewRouter = Router();
// Tìm kiếm
reviewRouter.get("/:id/search", reviewController.searchReviews);

// Xóa
reviewRouter.delete("/:id", reviewController.delReviews);

// Hiển thị review dựa theo sản phẩm
reviewRouter.get("/:id", reviewController.showReviews);

export default reviewRouter;
