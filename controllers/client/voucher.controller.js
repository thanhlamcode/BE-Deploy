import Voucher from "../../models/voucher.model.js";

const voucherController = {
  // [GET] client/voucher/
  showVoucher: async (req, res) => {
    try {
      const vouchers = await Voucher.find();

      res.status(200).json(vouchers);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  //[GET] client/voucher/my-voucher
  showMyVoucher: async (req, res) => {
    try {
      const myVoucher = await Voucher.find({
        clients: {
          $elemMatch: {
            clientId: req.params.id,
            usageLimitPerCustomer: { $gt: 0 },
          },
        },
      });

      res.status(200).json(myVoucher);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  //[POST] client/voucher/
  addVoucher: async (req, res) => {
    try {
      const voucherId = req.body.voucherId;
      const clientId = req.params.id;

      const voucherExist = await Voucher.findOne({
        _id: voucherId,
        clients: {
          $elemMatch: {
            clientId: clientId,
            usageLimitPerCustomer: { $gt: 0 },
          },
        },
      });

      if (voucherExist) {
        return res.status(400).json(false);
      }

      const result = await Voucher.findOneAndUpdate(
        { _id: voucherId },
        {
          $push: {
            clients: {
              clientId: clientId,
              usageLimitPerCustomer: req.body.usageLimitPerCustomer,
            },
          },
        }
      );

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [PATCH] /client/voucher/my-voucher/del
  delVoucher: async (req, res) => {
    try {
      const voucherId = req.body.id;

      const result = await Voucher.findOneAndUpdate(
        { _id: voucherId },
        {
          $pull: {
            clients: {
              clientId: req.params.id,
            },
          },
        }
      );

      res.status(200).json(true);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] /client/voucher/my-voucher/search
  searchVoucher: async (req, res) => {
    try {
      // Lấy từ khóa tìm kiếm (nếu không có thì mặc định là chuỗi rỗng)
      const search = req.query.search || "";

      // Điều kiện lọc và sắp xếp
      let sort = req.query.sort || "voucherName"; // Mặc định sắp xếp theo tên voucher (voucherName)

      // Cấu trúc dữ liệu sắp xếp (tăng dần hoặc giảm dần)
      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      let sortBy = {};
      if (sort[1]) {
        sortBy[sort[0]] = sort[1];
      } else {
        sortBy[sort[0]] = "asc"; // Mặc định sắp xếp tăng dần
      }

      // Tìm kiếm trong voucherName, discountPercentage, và description
      const vouchers = await Voucher.find({
        $or: [
          { voucherName: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }).sort(sortBy);

      // Trả về kết quả tìm kiếm
      res.status(200).json(vouchers);
    } catch (err) {
      // Xử lý lỗi
      res.status(500).json(false);
    }
  },
};

export default voucherController;
