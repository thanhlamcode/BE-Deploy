import drive from "../config/googleDrive.js";

async function deleteFromDrive(req, res, next) {
  try {
    const fileId = req.params.fileId;

    if (!fileId) {
      return res.status(400).json(false);
    }

    const authorization = await drive();
    if (!authorization) {
      return res.status(500).json(false);
    }

    await authorization.files.delete({
      fileId: fileId,
    });

    next(); // Gọi next để tiếp tục chuỗi middleware
  } catch (error) {
    console.error(error);
    return res.status(500).json(false);
  }
}

export default deleteFromDrive;
