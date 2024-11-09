import mongoose from "mongoose";
import Product from "../../models/product.model.js";
import Brand from "../../models/brand.model.js";
import Category from "../../models/category.model.js";
import SeenProd from "../../models/seen.model.js";
import Specs from "../../models/specification.model.js";
import Tag from "../../models/tag.model.js";
import wishList from "../../models/wishlist.model.js";
import specsKey from "../../models/specsKey.model.js";

// Middleware
import deleteFromDrive from "../../middleware/delToDrive.js";

// [GET] /products
export const index = async (req, res) => {
  const product = await Product.find({}).populate("tag category");

  res.status(200).json(product);
};

// [POST] /products/postProduct
export const postProduct = async (req, res) => {
  try {
    console.log(req.body);

    // Kiểm tra mã và tên sản phẩm
    const { productCode, productName, tag, brand, variations } = req.body;

    // Kiểm tra nếu mã sản phẩm đã tồn tại
    const existingProductCode = await Product.findOne({ productCode });
    if (existingProductCode) {
      return res.status(400).json(false);
    }

    // Kiểm tra nếu tên sản phẩm đã tồn tại
    const existingProductName = await Product.findOne({ productName });
    if (existingProductName) {
      return res.status(400).json(false);
    }

    // Trong hàm postProduct
    const parsedTags = tag ? JSON.parse(tag) : []; // Nếu tags là chuỗi JSON

    const objectIdTags = parsedTags.map(
      (tag) => new mongoose.Types.ObjectId(tag)
    );

    // Tạo sản phẩm mới
    const newProduct = new Product({
      productCode,
      productName,
      description: req.body.description,
      productStatus: req.body.productStatus,
      imageURLs: req.imageUrls ? req.imageUrls : [],
      category: req.body.category, // Kiểm tra nếu có category
      tag: objectIdTags, // Gán tag
      brand: req.body.brand, // Gán brand
      slug: req.body.slug, // Gán slug
    });

    const savedProduct = await newProduct.save();

    console.log("Variations: " + variations);

    const parsedVariations = Array.isArray(variations)
      ? variations
      : JSON.parse(variations || "[]") || [];

    // Tích hợp tạo Specification
    if (Array.isArray(parsedVariations) && parsedVariations.length > 0) {
      // Kiểm tra tính hợp lệ của từng specification và tạo Specification riêng lẻ
      for (let variation of parsedVariations) {
        // Duyệt qua từng specification trong variation
        const validSpecifications = await Promise.all(
          variation.specifications.map(async (spec) => {
            const isValidKey = await specsKey.findById(spec.key);

            // Trả về { key, value } nếu hợp lệ, ngược lại là null
            return isValidKey ? { key: spec.key, value: spec.value } : null;
          })
        );

        // Lọc ra các specification hợp lệ
        const filteredSpecifications = validSpecifications.filter(
          (spec) => spec !== null
        );

        // Nếu có ít nhất một specification hợp lệ, tạo Specification mới
        if (filteredSpecifications.length > 0) {
          const newSpec = new Specs({
            specCode: variation.specCode,
            specifications: filteredSpecifications,
            stockQuantity: variation.stockQuantity,
            price: variation.price,
            products: savedProduct._id,
            discountPercentage: req.body.discountPercentage,
          });

          await newSpec.save();

          savedProduct.specs.push(newSpec._id);

          // Gán Specification mới tạo vào sản phẩm
          await savedProduct.updateOne({ $push: { specs: newSpec._id } });
        }
      }
    }

    // Cập nhật brand với sản phẩm mới tạo
    if (brand) {
      const brandDoc = await Brand.findById(brand);
      if (brandDoc) {
        await brandDoc.updateOne({ $push: { products: savedProduct._id } });
      }
    }

    // Cập nhật tag với sản phẩm mới tạo
    if (Array.isArray(parsedTags) && parsedTags.length > 0) {
      for (const tagId of parsedTags) {
        const tagDoc = await Tag.findById(tagId);
        if (tagDoc) {
          await tagDoc.updateOne({ $push: { products: savedProduct._id } });
        }
      }
    }

    res.status(200).json(savedProduct);
  } catch (error) {
    console.log(error);

    return res.status(400).json(error);
  }
};

// [PATCH] /products/editProduct
export const editProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Tìm sản phẩm hiện tại
    const existingProduct = await Product.findById(id).populate("specs");
    if (!existingProduct) {
      return res.status(404).json(false);
    }
    // Xử lý hình ảnh mới nếu có

    let newImgUrl = [];

    console.log("NC: " + req.body.variations);

    // Kiểm tra req.imageUrls
    if (req.imageUrls && req.imageUrls.length > 0) {
      newImgUrl = req.imageUrls;

      if (req.body.imageUrls) {
        // Đảm bảo newImgUrl là một mảng đúng
        newImgUrl = [...newImgUrl, ...JSON.parse(req.body.imageUrls)];
      }
    }
    // Kiểm tra req.body.imageUrls nếu req.imageUrls không có giá trị
    else if (req.body.imageUrls) {
      newImgUrl = JSON.parse(req.body.imageUrls);
    }
    const oldImgUrl = existingProduct.imageURLs || [];

    // Nếu có sự thay đổi trong danh sách hình ảnh (bao gồm cả giảm số lượng)
    if (newImgUrl.length !== oldImgUrl.length) {
      // Tìm những hình ảnh cũ cần xóa
      const imgUrlsToDelete = oldImgUrl.filter(
        (url) => !newImgUrl.includes(url)
      );

      // Xóa hình ảnh cũ trên Google Drive
      for (const url of imgUrlsToDelete) {
        const urlParams = new URL(url);
        const fileId = urlParams.searchParams.get("id");
        if (fileId) {
          await deleteFromDrive({ params: { fileId: fileId } }, res, () => { });
        }
      }

      // Cập nhật danh sách hình ảnh mới
      existingProduct.imageURLs = newImgUrl;
    }

    // Xử lý cập nhật specs
    const { variations } = req.body;

    const parsedVariations = Array.isArray(variations)
      ? variations
      : JSON.parse(variations || "[]") || [];

    if (Array.isArray(parsedVariations) && parsedVariations.length > 0) {
      const specIdsToKeep = []; // Dùng để lưu các specIds của sản phẩm cần giữ lại

      for (let variation of parsedVariations) {
        console.log("SI: " + variation.specId);

        // Tìm spec hiện tại với specCode và productId
        let existingSpec = await Specs.findOne({
          specCode: variation.specCode,
          products: req.params.id, // Chỉ tìm các specs có chứa product hiện tại
        });

        if (existingSpec) {
          // Cập nhật specifications (key-value)
          existingSpec.specifications = await Promise.all(
            variation.specifications.map(async (spec) => {
              const isValidKey = await specsKey.findById(spec.key);
              return isValidKey ? { key: spec.key, value: spec.value } : null;
            })
          ).then((specs) => specs.filter((spec) => spec !== null));

          // Cập nhật các trường khác của spec
          existingSpec.stockQuantity = variation.stockQuantity;
          existingSpec.price = variation.price;
          existingSpec.discountPercentage = variation.discountPercentage;

          await existingSpec.save(); // Lưu thay đổi

          // Thêm specId vào danh sách giữ lại
          specIdsToKeep.push(existingSpec._id);
        } else {
          // Tạo spec mới nếu không có specCode trùng
          const validSpecifications = await Promise.all(
            variation.specifications.map(async (spec) => {
              const isValidKey = await specsKey.findById(spec.key);
              return isValidKey ? { key: spec.key, value: spec.value } : null;
            })
          ).then((specs) => specs.filter((spec) => spec !== null));

          if (validSpecifications.length > 0) {
            const newSpec = new Specs({
              specCode: variation.specCode,
              specifications: validSpecifications,
              stockQuantity: variation.stockQuantity,
              price: variation.price,
              products: [req.params.id], // Liên kết sản phẩm vào spec mới
              discountPercentage: variation.discountPercentage,
            });
            await newSpec.save();

            // Thêm spec mới vào sản phẩm
            existingProduct.specs.push(newSpec._id);

            // Thêm specId vào danh sách giữ lại
            specIdsToKeep.push(newSpec._id);
          }
        }
      }

      // Xóa các specs không còn liên kết với sản phẩm
      await Specs.deleteMany({
        _id: { $nin: specIdsToKeep }, // Chỉ xóa những specs có id không nằm trong danh sách giữ lại
        products: { $in: [req.params.id] }, // Đảm bảo rằng spec vẫn còn liên kết với sản phẩm
      });
    }

    // Cập nhật category nếu có sự thay đổi
    if (
      req.body.category &&
      mongoose.Types.ObjectId.isValid(req.body.category)
    ) {
      existingProduct.category = req.body.category;

      const categoryDoc = await Category.findById(req.body.category);

      console.log("CTE: " + categoryDoc);
      if (categoryDoc) {
        await categoryDoc.updateOne({
          $addToSet: { products: existingProduct._id },
        });
      }
    }

    // Cập nhật brand nếu có sự thay đổi
    if (req.body.brand && mongoose.Types.ObjectId.isValid(req.body.brand)) {
      existingProduct.brand = req.body.brand;

      const brandDoc = await Brand.findById(req.body.brand);
      if (brandDoc) {
        await brandDoc.updateOne({
          $addToSet: { products: existingProduct._id },
        });
      }
    }

    if (req.body.tag) {
      const parsedTags = JSON.parse(req.body.tag);
      const objectIdTags = parsedTags.map(
        (tag) => new mongoose.Types.ObjectId(tag)
      );

      // Cập nhật lại tag cho sản phẩm
      existingProduct.tag = objectIdTags;

      // Cập nhật lại trong collection Tag
      for (const tagId of objectIdTags) {
        const tagDoc = await Tag.findById(tagId);
        if (tagDoc) {
          await tagDoc.updateOne({
            $addToSet: { products: existingProduct._id },
          });
        }
      }
    }

    // Cập nhật các trường khác của sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        imageURLs: existingProduct.imageURLs, // Cập nhật hình ảnh
        tag: existingProduct.tag, // Cập nhật tag nếu có sự thay đổi
        specs: existingProduct.specs, // Cập nhật specs nếu có sự thay đổi
        category: existingProduct.category,
        brand: existingProduct.brand,
      },
      {
        new: true, // Trả về sản phẩm đã cập nhật
      }
    ).populate("specs"); // Populate để lấy dữ liệu specs sau khi cập nhật

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: false,
    });
  }
};

// [DELETE] /products/deleteProduct/:id
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Xóa brand
    await Brand.updateOne(
      { products: productId },
      { $pull: { products: productId } }
    );

    // Xóa Category
    await Category.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    // Xóa Seen Product
    await SeenProd.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    // Xóa Tag Product
    await Tag.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    // Xóa Specs
    await Specs.deleteMany({ products: productId });

    // Xóa WishList
    await wishList.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    // Tìm sản phẩm theo ID
    const product = await Product.findById(productId);

    // Lấy danh sách hình ảnh để xóa
    for (const url of product.imageURLs) {
      const urlParams = new URL(url);
      const fileId = urlParams.searchParams.get("id");
      if (fileId) {
        // Gọi middleware xóa hình ảnh
        await deleteFromDrive({ params: { fileId: fileId } }, res, () => { });
      }
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json({
      message: false,
    });
  }
};

// [GET] /products/detail/:id
export const detail = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Product.findOne({ _id: id })
      .populate("tag category brand")
      .populate({
        path: "specs",
        populate: {
          path: "specifications.key",
        },
      });

    res.status(200).json(record);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: false,
    });
  }
};

// [GET] /products/search
export const search = async (req, res) => {
  try {
    const { productName, minPrice, maxPrice, productStatus } = req.query;

    let filter = {};

    // Nếu có tên sản phẩm, sử dụng regex để tìm kiếm gần đúng (không phân biệt hoa thường)
    if (productName) {
      filter.productName = { $regex: productName, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
        // Lớn hơn hoặc bằng regex
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
        // Bé hơn hoặc bằng regex
      }
    }

    // Nếu có lọc trạng thái sản phẩm
    if (productStatus) {
      filter.productStatus = productStatus;
    }

    // Truy vấn sản phẩm dựa trên điều kiện lọc
    const products = await Product.find(filter);

    // Trả về danh sách sản phẩm
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [GET] /stats/specs-per-product
export const getProductSpecsStatistics = async (req, res) => {
  try {
    const sort = req.query.sort === "asc" ? 1 : -1;
    const stats = await Product.aggregate([
      {
        $lookup: {
          from: "specifications", // Bảng tham chiếu
          localField: "specs", // Trường specs trong Product
          foreignField: "_id", // Liên kết với _id trong specifications
          as: "specifications", // Tên trường sẽ chứa các specs liên kết
        },
      },
      {
        $project: {
          productName: 1,
          specsCount: { $size: "$specifications" }, // Số lượng specs
          specsIDs: "$specs", // Mảng chứa các specs ID
        },
      },
      { $sort: { specsCount: sort } }, // Sắp xếp theo số lượng specs
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json(false);
  }
};

// [GET] /stats/product-discount
export const getProductWithDiscountStatistics = async (req, res) => {
  try {
    const sort = req.query.sort === "asc" ? 1 : -1;
    const stats = await Specs.aggregate([
      {
        $group: {
          _id: {
            $cond: {
              if: { $gt: ["$discountPercentage", 0] },
              then: "Discounted",
              else: "No Discount",
            },
          }, // Nhóm theo có/không giảm giá
          count: { $sum: 1 }, // Đếm số lượng sản phẩm
          productIDs: { $push: "$products" }, // Mảng chứa các product ID có giảm giá
        },
      },
      { $sort: { count: sort } }, // Sắp xếp theo số lượng
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json(false);
  }
};

// [GET] /stats/total-stock-value
export const getTotalStockValue = async (req, res) => {
  try {
    const stats = await Specs.aggregate([
      {
        $group: {
          _id: null, // Không nhóm theo trường nào cụ thể
          totalStockValue: {
            $sum: { $multiply: ["$price", "$stockQuantity"] },
          }, // Tính tổng giá trị hàng tồn kho
        },
      },
      {
        $project: {
          _id: 0, // Không hiển thị _id
          totalStockValue: 1,
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json(false);
  }
};

// [GET] /products/statistic-brand/:brandId
export const statisticBrand = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const brand = await Brand.findOne({ _id: brandId }).populate("products");
    res.status(200).json(brand.products);
  } catch (error) {
    res.status(500).json(false);
  }
};
