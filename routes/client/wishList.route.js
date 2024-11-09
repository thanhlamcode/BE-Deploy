import { Router } from "express";
import wishListController from "../../controllers/client/wishlist.controller.js";

const wishListRouter = Router();

// WISHLIST

// Thêm sản phẩm vào wishlist
wishListRouter.post("/add-to-wishList/:id", wishListController.addToWishList);

// Tìm kiếm sản phẩm trong wishlist
wishListRouter.get(
  "/my-wishList/:id/search",
  wishListController.searchWishList
);

// Xóa sản phẩm ra khỏi danh sách yêu thích
wishListRouter.patch(
  "/my-wishList/del-from-wishList/:id",
  wishListController.delfromWishList
);

// Hiển thị danh sách sản phẩm trong wishlist
wishListRouter.get("/my-wishList/:id", wishListController.showWishList);

export default wishListRouter;
