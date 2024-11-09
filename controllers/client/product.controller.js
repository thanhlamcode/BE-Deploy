import Product from "../../models/product.model.js";

const productController = {
  // [GET] /client/product
  showProduct: async (req, res) => {
    try {
      const products = await Product.find().populate("tag category specs");

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] client/product/details
  showDetailsProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const specs = await Product.findById(productId).populate("specs");

      res.status(200).json(specs);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] client/product/search
  searchProduct: async (req, res) => {
    try {
      // Lấy từ khóa tìm kiếm (nếu không có thì mặc định là chuỗi rỗng)
      const search = req.query.search || "";

      // Điều kiện lọc và sắp xếp
      let sort = req.query.sort || "productName"; // Mặc định sắp xếp theo tên sản phẩm (productName)

      // Cấu trúc dữ liệu sắp xếp (tăng dần hoặc giảm dần)
      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      let sortBy = {};
      if (sort[1]) {
        sortBy[sort[0]] = sort[1];
      } else {
        sortBy[sort[0]] = "asc"; // Mặc định sắp xếp tăng dần
      }

      // Tìm kiếm trong productCode, productName và description
      const products = await Product.find({
        $or: [
          { productCode: { $regex: search, $options: "i" } },
          { productName: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }, // Tìm kiếm thêm theo description
        ],
      }).sort(sortBy);

      // Trả về kết quả tìm kiếm
      res.status(200).json(products);
    } catch (err) {
      // Xử lý lỗi
      res.status(500).json(false);
    }
  },

  // [GET] /client/product/relative/:idProduct
  relativeProduct: async (req, res) => {
    try {
      const id = req.params.productId;

      console.log(id);

      const products = await Product.findOne({ _id: id }).populate(
        "relativeProduct"
      );

      let result = [];

      if (products.relativeProduct.length > 0) {
        result = products.relativeProduct;
      }

      res.json(result);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] client/tag/search
  searchTag: async (req, res) => {
    try {
      const { tagId } = req.params;
      const products = await Product.find({
        tag: tagId,
      });

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  getProductBySlug: async (req, res) => {
    try {
      const slug = req.params.slug;
      console.log(slug);

      const product = await Product.findOne({ slug: slug }).populate([
        { path: "relativeProduct" },
        { path: "tag" },
        { path: "specs" },
        { path: "category" },
        { path: "brand", select: "brandCode brandName" }, // Replace with actual fields in the "Brand" schema
      ]);

      res.json(product);
    } catch (error) {
      res.json(false);
    }
  },
};

export default productController;