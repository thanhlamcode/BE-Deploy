import Category from "../../models/category.model.js";

// [GET] /client/category
export const index = async (req, res) => {
  try {
    const category = await Category.find({});

    res.json(category);
  } catch (error) {
    res.status(400).json(false);
  }
};

// [GET] /client/category/search
export const search = async (req, res) => {
  try {
    const { categoryCode, categoryName } = req.query;

    const filter = {};

    if (categoryCode) {
      filter.categoryCode = categoryCode;
    }

    if (categoryName) {
      filter.categoryName = { $regex: categoryName, $options: "i" };
    }

    const category = await Category.find(filter);

    res.json(category);
  } catch (error) {
    res.status(400).json(false);
  }
};
