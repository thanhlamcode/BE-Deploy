import Voucher from "../../models/voucher.model.js";

// [GET] /voucher
export const index = async (req, res) => {
  const voucher = await Voucher.find({});

  res.status(200).json(voucher);
};

// [POST] /voucher/add
export const add = async (req, res) => {
  try {
    console.log(req.body);

    const record = new Voucher(req.body);
    await record.save();

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [PATCH] /voucher/edit
export const edit = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Voucher.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [DELETE] /voucher/delete/:id
export const deleteVoucher = async (req, res) => {
  try {
    const id = req.params.id;

    const voucher = await Voucher.deleteOne({ _id: id });

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [GET] /tag/search
export const search = async (req, res) => {
  try {
    // Khởi tạo filter là một đối tượng trống
    let filter = {};

    // Lấy giá trị từ query params
    const { voucherName, minDiscount, maxDiscount, minPrice, maxPrice } =
      req.query;

    if (voucherName) {
      filter.voucherName = { $regex: voucherName, $options: "i" };
    }

    // Nếu có điều kiện lọc theo khoảng khuyến mãi
    if (minDiscount || maxDiscount) {
      filter.discountPercentage = {};
      if (minDiscount) {
        filter.discountPercentage.$gte = parseFloat(minDiscount); // Lọc giá trị lớn hơn hoặc bằng minDiscount
      }
      if (maxDiscount) {
        filter.discountPercentage.$lte = parseFloat(maxDiscount); // Lọc giá trị nhỏ hơn hoặc bằng maxDiscount
      }
    }

    // Nếu có điều kiện lọc theo lượng tiền
    if (minPrice || maxPrice) {
      filter.fixedAmount = {};
      if (minPrice) {
        filter.fixedAmount.$gte = parseFloat(minPrice); // Lọc giá trị lớn hơn hoặc bằng
      }
      if (maxPrice) {
        filter.fixedAmount.$lte = parseFloat(maxPrice); // Lọc giá trị nhỏ hơn hoặc bằng
      }
    }

    // Tìm kiếm với bộ lọc filter
    const voucher = await Voucher.find(filter);

    // Trả về kết quả
    res.status(200).json(voucher);
  } catch (error) {
    res.status(500).json(false);
  }
};
