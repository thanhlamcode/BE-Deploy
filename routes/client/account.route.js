import { Router } from "express";
import accountController from "../../controllers/client/account.controller.js";

const accountRouter = Router();

// Xem thông tin cá nhân
accountRouter.get("/details/:id", accountController.showDetailsInfo);

// Sửa thông tin cá nhân
accountRouter.patch("/details/:id", accountController.updateDetailsInfo);

// Detail thông qua token
accountRouter.get("/token/information", accountController.detailInformation);

export default accountRouter;
