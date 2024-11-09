import jwt from "jsonwebtoken";
import AccountModel from "../models/account.model.js";

const secretKey = "your-secret-key"; // Khóa bí mật để ký JWT, bạn nên lưu khóa này ở file .env

export const authenticateJWT = (req, res, next) => {
  next();
  return;
  const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header Authorization
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: "Bạn cần đăng nhập để truy cập tài nguyên này",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Xác minh token
    req.user = decoded; // Lưu thông tin người dùng vào req để sử dụng sau
    next();
  } catch (error) {
    return res.status(403).json({
      code: 403,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header Authorization
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: "Bạn cần đăng nhập để truy cập tài nguyên này",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Xác minh token
    console.log(decoded);

    const info = await AccountModel.findOne({ _id: decoded.id });

    if (info.accountRole != "admin") {
      return res.json("Bạn đéo phải admin mà vào đây làm gì???");
    }

    next();
  } catch (error) {
    return res.status(403).json({
      code: 403,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};
