import Account from "../../models/account.model.js";
import jwt from "jsonwebtoken"; // Thêm dòng này để sử dụng JWT
const secretKey = "your-secret-key"; // Nên lưu khóa này ở file .env

const accountController = {
  // [GET] client/account/details/:id
  showDetailsInfo: async (req, res) => {
    try {
      const client = await Account.findById(req.params.id);

      res.status(200).json(client);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [PATCH] client/account/details/:id
  updateDetailsInfo: async (req, res) => {
    try {
      // const allowedUpdates = [
      //   "password",
      //   "firstName",
      //   "lastName",
      //   "email",
      //   "phoneNumber",
      //   "dateOfBirth",
      // ];
      const updates = Object.keys(req.body);
      
      // const isValidOperation = updates.every((update) =>
      //   allowedUpdates.includes(update)
      // );

      // if (!isValidOperation) {
      //   return res.status(400).json(true);
      // }

      const client = await Account.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      res.status(200).json(client);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  detailInformation: async (req, res) => {
    try {
      // res.json("ok");
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, secretKey);

      const userId = decoded.id;
      const userInfo = await Account.findById(userId);

      res.status(200).json(userInfo);
    } catch (error) {
      console.error("Error in detailInformation:", error); // Ghi lỗi chi tiết
      res.status(500).json({ error: "Internal Server Error" }); // Trả về lỗi rõ ràng hơn
    }
  },
};

export default accountController;
