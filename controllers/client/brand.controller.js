import _Brand from "../../models/brand.model.js";

// [GET] /client/brand
export const index = async (req, res) => {
  try {
    const brand = await _Brand.find({});

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [GET] /client/brand/:idBrand
export const getProduct = async (req, res) => {
  try {
    const idBrand = req.params.idBrand;
    console.log(idBrand);

    const brand = await _Brand.findOne({ _id: idBrand }).populate("products");
    console.log(brand);

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [GET] /client/brand/search
export const search = async (req, res) => {
  try {
    const { brandCode, brandName } = req.query;

    const searchConditions = {};
    if (brandCode) {
      searchConditions.brandCode = brandCode;
    }
    if (brandName) {
      // Sử dụng biểu thức chính quy để tìm kiếm không phân biệt hoa thường
      searchConditions.brandName = new RegExp(brandName, "i");
    }

    const brands = await _Brand.find(searchConditions).populate("products");

    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json(false);
  }
};
