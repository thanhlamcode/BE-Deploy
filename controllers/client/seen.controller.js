import Seen from "../../models/seen.model.js";

// [POST] /client/seen/add
export const add = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Tìm xem người dùng đã có danh sách xem gần đây chưa
    const seen = await Seen.findOne({ userId: userId });

    if (!seen) {
      const record = new Seen({
        userId: userId,
        products: [productId],
      });

      await record.save();
      return res.status(200).json(record);
    }

    // Kiểm tra sản phẩm đã tồn tại trong danh sách chưa
    if (seen.products.includes(productId)) {
      return res.status(200).json(true);
    }

    // Nếu danh sách đã đủ 10 sản phẩm, xóa sản phẩm đầu tiên
    if (seen.products.length >= 10) {
      seen.products.shift(); // Xóa phần tử đầu tiên
    }

    // Thêm productId vào cuối mảng
    seen.products.push(productId);

    // Lưu cập nhật
    const record = await Seen.findOneAndUpdate(
      { userId: userId },
      {
        products: seen.products,
      }
    );

    res.status(200).json(record);
  } catch (error) {
    res.status(400).json(false);
  }
};

// [GET] /client/seen/:userId
export const getSeenProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm bản ghi `seen` của người dùng
    const seen = await Seen.findOne({ userId: userId }).populate("products");

    console.log(seen);
    
    if (!seen || seen.products.length === 0) {
      return res.status(404).json(false);
    }

    res.status(200).json(seen.products);
  } catch (error) {
    res.status(400).json(false);
  }
};
