import mongoose from "mongoose";
import Spec from "../../models/specification.model.js";
import Product from "../../models/product.model.js";
import specsKey from "../../models/specsKey.model.js";

const specController = {
  // [GET] /spec
  showSpec: async (req, res) => {
    try {
      const specsList = await Spec.find();

      const populatedSpecsList = await Promise.all(
        specsList.map(async (spec) => {
          const populatedSpecifications = await Promise.all(
            spec.specifications.map(async (item) => {
              // Fetch the SpecificationKey by ID in 'key'
              const specificationKey = await specsKey.findById(item.key);
              return {
                key: specificationKey, // replace key ID with full specificationKey document
                value: item.value,
              };
            })
          );
          return {
            ...spec.toObject(),
            specifications: populatedSpecifications,
          };
        })
      );

      res.status(200).json(populatedSpecsList);
    } catch (err) {
      // Xử lý lỗi
      res.status(500).json(false);
    }
  },

  // [POST] /spec
  addSpec: async (req, res) => {
    try {
      // Lấy dữ liệu từ request body
      const { specCode, specifications, stockQuantity, price, products } =
        req.body;

      // Kiểm tra nếu mã Specification đã tồn tại
      const specExist = await Spec.findOne({ specCode: specCode });
      if (specExist) {
        return res.status(400).json(false);
      }

      // Kiểm tra từng key của specifications nếu có (không yêu cầu tất cả phải tồn tại)
      const validSpecs = await Promise.all(
        specifications.map(async (spec) => {
          // Kiểm tra key có trong SpecificationKey không
          const isValidKey = await specsKey.findById(spec.key); // Sửa lại từ `_id` thành `key`
          return isValidKey ? { key: spec.key, value: spec.value } : null; // Chỉ giữ các specifications hợp lệ
        })
      );

      // Lọc các specifications hợp lệ
      const filteredSpecs = validSpecs.filter((spec) => spec !== null);

      // Tạo mới Specification với các specifications hợp lệ
      const newSpec = new Spec({
        specCode,
        specifications: filteredSpecs,
        stockQuantity,
        price,
        products,
      });

      await newSpec.save();

      // Cập nhật Product với Specification mới
      const productOrigin = await Product.findById(products);
      if (productOrigin) {
        await productOrigin.updateOne({ $push: { specs: newSpec._id } });
      }

      res.status(200).json(newSpec);
    } catch (err) {
      res.status(500).json({ message: false });
    }
  },

  // [DELETE] /spec/:specId
  delSpec: async (req, res) => {
    try {
      await Product.updateOne(
        { specs: req.params.specId }, // Tìm
        { $pull: { specs: req.params.specId } } // Lấy ra khỏi array
      );
      const spec = await Spec.findByIdAndDelete(req.params.specId);

      res.status(200).json(true);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  delSpecification: async (req, res) => {
    try {
      // const updatedProduct = await Product.updateOne(
      //   { "specs._id": req.params.specId },
      //   { $pull: { "specs.$.specifications": { key: req.params.keyId } } }
      // );

      // console.log(updatedProduct);

      await Product.updateOne(
        {
          "specs._id": req.params.specId,
          "specs.specifications": { $size: 0 },
        },
        { $pull: { specs: { _id: req.params.specId } } }
      );

      await Spec.updateOne(
        { _id: req.params.specId },
        { $pull: { specifications: { key: req.params.keyId } } }
      );

      res.status(200).json(true);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [PATCH] /specification/:specId/:keyId
  updateSpecification: async (req, res) => {
    try {
      const { specId, keyId } = req.params;
      console.log(req.body);

      const { key, value } = req.body;

      // Find the Specification document by its specId
      const spec = await Spec.findById(specId);

      if (!spec) {
        return res.status(404).json({ error: "Specification not found" });
      }

      // Find the index of the specification item to update based on keyId
      const specIndex = spec.specifications.findIndex(
        (item) => item.key.toString() === keyId.toString()
      );

      if (specIndex === -1) {
        return res
          .status(404)
          .json({ error: "Specification item with the given key not found" });
      }

      // Update the value of the specified key in the specification
      spec.specifications[specIndex].value = value;

      // Save the updated specification
      await spec.save();

      // Return success response
      return res
        .status(200)
        .json({ message: "Specification updated successfully", spec });
    } catch (err) {
      console.log(err);

      res.status(500).json(false);
    }
  },

  // [PATCH] /spec
  updateSpec: async (req, res) => {
    try {
      const result = await Spec.findOneAndUpdate(
        { _id: req.params.specId },
        { $set: req.body },
        { new: true }
      );

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] /spec/search
  // [GET] /spec/search
  searchSpec: async (req, res) => {
    try {
      let filter = {};

      // Lấy giá trị từ query params
      const { search, minStock, maxStock, minPrice, maxPrice } = req.query;

      // Điều kiện tìm kiếm trong specCode hoặc specifications nếu có từ khóa search
      if (search) {
        const specKeyIds = await mongoose
          .model("SpecificationKey")
          .find({
            key: { $regex: search, $options: "i" },
          })
          .select("_id");

        filter.$or = [
          { specCode: { $regex: search, $options: "i" } },
          {
            "specifications.key": { $in: specKeyIds.map((doc) => doc._id) },
          },
          {
            "specifications.value": { $regex: search, $options: "i" },
          },
        ];
      }

      // Điều kiện lọc cho số lượng tồn kho
      if (minStock || maxStock) {
        filter.stockQuantity = {};
        if (minStock) {
          filter.stockQuantity.$gte = parseInt(minStock);
        }
        if (maxStock) {
          filter.stockQuantity.$lte = parseInt(maxStock);
        }
      }

      // Điều kiện lọc cho giá
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
          filter.price.$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          filter.price.$lte = parseFloat(maxPrice);
        }
      }

      // Sắp xếp theo query param hoặc mặc định là specCode tăng dần
      let sortBy = {};
      const sort = req.query.sort ? req.query.sort.split(",") : ["specCode"];
      sortBy[sort[0]] = sort[1] === "desc" ? -1 : 1;

      console.log("Sort By:", sortBy);

      // Tìm kiếm và sắp xếp với bộ lọc
      const specifications = await Spec.find(filter).sort(sortBy);

      // Trả về kết quả
      res.status(200).json(specifications);
    } catch (err) {
      console.error(err); // Log lỗi để kiểm tra chi tiết
      res.status(500).json(false);
    }
  },

  // [GET] /specification-keys
  showSpecKey: async (req, res) => {
    try {
      const _specKey = await specsKey.find();

      if (!_specKey || _specKey.length === 0) {
        res.status(400).json(false);
      }

      res.status(200).json(_specKey);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [POST] /specification-keys
  addSpecKey: async (req, res) => {
    try {
      // Nếu chỉ có một đối tượng thì chuyển thành mảng chứa một phần tử
      const keys = Array.isArray(req.body.keys) ? req.body.keys : [req.body];

      // Tìm các khóa đã tồn tại để tránh trùng lặp
      const existingKeys = await specsKey
        .find({ key: { $in: keys.map((k) => k.key) } })
        .select("key");
      const existingKeyNames = existingKeys.map((key) => key.key);

      // Lọc ra các khóa chưa tồn tại
      const newKeys = keys.filter((k) => !existingKeyNames.includes(k.key));

      // Tạo các bản ghi specsKey mới
      const specKeyInstances = newKeys.map((k) => new specsKey({ key: k.key }));

      // Thêm các khóa mới vào cơ sở dữ liệu
      if (specKeyInstances.length > 0) {
        await specsKey.insertMany(specKeyInstances);
      }

      res.status(200).json(specKeyInstances);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [DELETE] /specification-keys/:id
  delSpecKey: async (req, res) => {
    try {
      await specsKey.findByIdAndDelete(req.params.id);

      res.status(200).json(true);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [PATCH] /specification-keys/:id
  updtSpecKey: async (req, res) => {
    try {
      const result = await specsKey.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(false);
    }
  },
};

export default specController;
