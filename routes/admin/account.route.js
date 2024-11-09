import { Router } from "express";
import accountController from "../../controllers/admin/accountController.js";

const accountRouter = Router();

// Tìm kiếm tài khoản
accountRouter.get("/Quan-ly-tai-khoan/search", accountController.searchAccount);

// Xem danh sách các tài khoản
accountRouter.get("/Quan-ly-tai-khoan", accountController.showAccount);

// Xem chi tiết thông tin tài khoản
accountRouter.get(
  "/Quan-ly-tai-khoan/:accountCode",
  accountController.accountDetails
);

// Chỉnh sửa trạng thái tài khoản
accountRouter.patch(
  "/Quan-ly-tai-khoan/:accountCode/Chinh-sua-trang-thai-tai-khoan",
  accountController.accountUpdateStatus
);

// Xóa tài khoản
accountRouter.delete(
  "/Quan-ly-tai-khoan/:accountCode",
  accountController.deleteAccount
);

export default accountRouter;
