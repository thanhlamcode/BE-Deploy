import { Router } from "express";
import accountController from "../../controllers/admin/accountController.js";
import * as controller from "../../controllers/admin/product.controller.js";

const accountRouter = Router();

// Thống kê theo ngày
accountRouter.get("/daily", accountController.getNewUsersByDay);

//Thống kê theo tuần
accountRouter.get("/weekly", accountController.getNewUsersByWeek);

//Thống kê theo tháng
accountRouter.get("/monthly", accountController.getNewUsersByMonth);

//Thống kê theo loại tài khoản
accountRouter.get("/roles", accountController.getAccountRoleStatistics);

// Thống kê Product Specs
// Thống kê số lượng các thông số kỹ thuật (specs) theo sản phẩm
accountRouter.get("/specs-per-product", controller.getProductSpecsStatistics);

// Thống kê số lượng sản phẩm có giảm giá
accountRouter.get(
  "/product-discount",
  controller.getProductWithDiscountStatistics
);

// Thống kê tổng giá trị hàng trong kho (stock value)
accountRouter.get("/total-stock-value", controller.getTotalStockValue);

export default accountRouter;
