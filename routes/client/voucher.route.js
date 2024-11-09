import { Router } from "express";
import voucherController from "../../controllers/client/voucher.controller.js";

const voucherRoutes = Router();
// Tìm kiếm voucher
voucherRoutes.get("/my-voucher/search", voucherController.searchVoucher);

// Xóa (soft-delete) voucher
voucherRoutes.patch("/my-voucher/del/:id", voucherController.delVoucher);

// Xem voucher cá nhân
voucherRoutes.get("/my-voucher/:id", voucherController.showMyVoucher);

// Thêm voucher
voucherRoutes.post("/:id", voucherController.addVoucher);

// Xem tất cả các voucher
voucherRoutes.get("/", voucherController.showVoucher);

export default voucherRoutes;
