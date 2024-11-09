import Category from "../../models/category.model.js";

// [GET] /category
export const index = async (req, res) => {
  const category = await Category.find({});

  res.status(200).json(category);
};

// [POST] /category/add
export const add = async (req, res) => {
  try {
    console.log(req.body);

    const exitCategory = await Category.findOne({
      categoryCode: req.body.categoryCode,
    });
    if (exitCategory) {
      return res.status(400).json(false);
    }

    const record = new Category(req.body);
    await record.save();

    res.json(record);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [PATCH] /category/edit
export const edit = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Category.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [DELETE] /category/delete/:id
export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.deleteOne({ _id: id });

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [GET] /category/search
export const search = async (req, res) => {
  try {
    // Khởi tạo filter là một đối tượng trống
    let filter = {};

    // Lấy giá trị từ query params
    const { categoryCode, categoryName } = req.query;

    // Kiểm tra nếu categoryCode có trong query
    if (categoryCode) {
      filter.categoryCode = categoryCode; // Tìm kiếm chính xác theo categoryCode
    }

    // Kiểm tra nếu categoryName có trong query
    if (categoryName) {
      filter.categoryName = { $regex: categoryName, $options: "i" }; // Tìm kiếm gần đúng theo categoryName, không phân biệt hoa thường
    }

    // Tìm kiếm với bộ lọc filter
    const categories = await Category.find(filter);

    // Trả về kết quả
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(false);
  }
};
