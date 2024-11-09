import drive from "../config/googleDrive.js";
import fs from "fs";
import path from "path";

async function uploadToDrive(req, res, next) {
  try {
    const files = req.files; // Lấy tất cả các tệp từ req.files
    const folderId = "1CmrmFj8DSW0Hqsm1HfiW22CUthH4PFko"; // ID của thư mục đích

    const authorization = await drive();
    if (!authorization) {
      return res.status(500).json(false);
    }

    if (!files || files.length === 0) {
      req.imageUrls = [];
      return next(); // Ngăn chặn đoạn mã bên dưới chạy
    }

    req.imageUrls = []; // Khởi tạo mảng để lưu trữ các URL hình ảnh

    for (const file of files) {
      const tempFilePath = path.join("/tmp", file.originalname); // Lưu file tạm trong thư mục `/tmp`

      // Ghi nội dung của file vào đường dẫn tạm thời
      fs.writeFileSync(tempFilePath, file.buffer);

      // Tải file lên Google Drive vào thư mục đích
      const response = await authorization.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimetype,
          parents: [folderId], // Chỉ định thư mục đích
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(tempFilePath),
        },
      });

      const fileId = response.data.id;

      // Cấp quyền xem công khai cho file nhưng không cho phép chỉnh sửa
      await authorization.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader", // Quyền xem (không chỉnh sửa)
          type: "anyone", // Công khai cho mọi người
        },
      });

      // Lấy URL công khai để xem file
      const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
      req.imageUrls.push(imageUrl); // Thêm URL vào mảng

      // Xóa file tạm sau khi upload lên Google Drive
      fs.unlinkSync(tempFilePath);
    }

    next();
  } catch (error) {
    res.status(500).json(error);
  }
}

export default uploadToDrive;
