import Brand from "../../models/brand.model.js";
import Product from "../../models/product.model.js";

const brandController = {
  // [GET] /brand/
  showBrand: async (req, res) => {
    try {
      const brands = await Brand.find();
      res.status(200).json(brands);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [POST] /brand
  addBrand: async (req, res) => {
    try {
      const _brand = new Brand(req.body);
      const id = await Brand.findById(_brand._id);

      if (id) {
        return res.status(400).json(false);
      }

      await _brand.save();

      res.status(200).json(_brand);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] /brand/:id
  showProductsBrand: async (req, res) => {
    try {
      const products = await Brand.findById(req.params.id).populate("products");

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [DELETE] /brand/del
  delBrand: async (req, res) => {
    try {
      await Product.updateMany(
        { brand: req.params.id },
        { $unset: { brand: "" } }
      );

      const brand = await Brand.findByIdAndDelete(req.params.id);

      res.status(200).json(true);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [PATCH] /brand/
  updateBrand: async (req, res) => {
    try {
      const updateBrand = await Brand.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );

      res.status(200).json(updateBrand);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] /brand/search
  searchBrand: async (req, res) => {
    try {
      // Lấy từ khóa tìm kiếm (nếu không có thì mặc định là chuỗi rỗng)
      const search = req.query.search || "";

      // Điều kiện lọc và sắp xếp
      let sort = req.query.sort || "brandName"; // Mặc định sắp xếp theo tên thương hiệu (brandName)

      // Cấu trúc dữ liệu sắp xếp (tăng dần hoặc giảm dần)
      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      let sortBy = {};
      if (sort[1]) {
        sortBy[sort[0]] = sort[1];
      } else {
        sortBy[sort[0]] = "asc"; // Mặc định sắp xếp tăng dần
      }

      // Tìm kiếm trong brandCode và brandName
      const brands = await Brand.find({
        $or: [
          { brandCode: { $regex: search, $options: "i" } },
          { brandName: { $regex: search, $options: "i" } },
        ],
      }).sort(sortBy);

      // Trả về kết quả tìm kiếm
      res.status(200).json(brands);
    } catch (err) {
      // Xử lý lỗi
      res.status(500).json(false);
    }
  },
};

export default brandController;
