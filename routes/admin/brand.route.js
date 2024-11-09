import { Router } from "express";
import brandController from "../../controllers/admin/brand.controller.js";
import { isAdmin } from "../../middleware/authMiddleware.js";

const brandRoutes = Router();
// Tìm kiếm brand
brandRoutes.get("/search", brandController.searchBrand);
//Xóa brand
brandRoutes.delete("/del/:id", brandController.delBrand);

// Xem các sản phẩm trong brand
brandRoutes.get("/:id", brandController.showProductsBrand);

// Cập nhật brand
brandRoutes.patch("/:id", brandController.updateBrand);

// Thêm brand
brandRoutes.post("/", brandController.addBrand);

// Xem tất cả các brand
brandRoutes.get("/", brandController.showBrand);

export default brandRoutes;
