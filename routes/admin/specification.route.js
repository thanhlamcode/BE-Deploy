import { Router } from "express";
import specController from "../../controllers/admin/specification.controller.js";

const specRouter = Router();

// Tìm kiếm specification
specRouter.get("/search", specController.searchSpec);

// Sửa specification
specRouter.patch("/:specId", specController.updateSpec);

// Xóa specification / xóa biến thể
specRouter.delete("/:specId", specController.delSpec);

specRouter.delete("/specification/:specId/:keyId", specController.delSpecification);
specRouter.patch("/specification/:specId/:keyId", specController.updateSpecification);

// Thêm specification
specRouter.post("/", specController.addSpec);

// Hiển thị specification
specRouter.get("/", specController.showSpec);

// Hiển thị các Specs Key
specRouter.get("/specification-keys", specController.showSpecKey);

// Add Specs Key
specRouter.post("/specification-keys", specController.addSpecKey);

// Delete Specs Key
specRouter.delete("/specification-keys/:id", specController.delSpecKey);

//Update Specs Key
specRouter.patch("/specification-keys/:id", specController.updtSpecKey);

export default specRouter;
