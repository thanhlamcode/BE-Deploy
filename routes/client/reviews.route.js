import { Router } from "express";
import reviewController from "../../controllers/client/reviews.controller.js";

const reviewRouter = Router();

// Thêm
reviewRouter.post("/:id", reviewController.addReviews);

// Xóa
reviewRouter.delete("/:id", reviewController.delReviews);

// Sửa
reviewRouter.patch("/:id", reviewController.updateReviews);
export default reviewRouter;
