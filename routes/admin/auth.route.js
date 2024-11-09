import { Router } from "express";
import accountController from "../../controllers/admin/accountController.js";

const authRouter = Router();

// Đăng nhập khách hàng và admin.
authRouter.post("/login", accountController.accountLogin);

authRouter.post("/register", accountController.register);

export default authRouter;
