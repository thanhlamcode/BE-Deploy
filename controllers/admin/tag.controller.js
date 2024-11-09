import Tag from "../../models/tag.model.js";

// [GET] /tag
export const index = async (req, res) => {
  const tag = await Tag.find({});

  res.json(tag);
};

// [POST] /tag/add
export const add = async (req, res) => {
  try {
    console.log(req.body);

    const exittag = await Tag.findOne({
      tagCode: req.body.tagCode,
    });
    if (exittag) {
      return res.status(400).json(false);
    }

    const record = new Tag(req.body);
    await record.save();

    res.json(record);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [PATCH] /tag/edit
export const edit = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Tag.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [DELETE] /tag/delete/:id
export const deletetag = async (req, res) => {
  try {
    const id = req.params.id;

    const tag = await Tag.deleteOne({ _id: id });

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
    const { tagCode, tagName } = req.query;

    // Kiểm tra nếu tagCode có trong query
    if (tagCode) {
      filter.tagCode = tagCode; // Tìm kiếm chính xác theo tagCode
    }

    // Kiểm tra nếu tagName có trong query
    if (tagName) {
      filter.tagName = { $regex: tagName, $options: "i" }; // Tìm kiếm gần đúng theo tagName, không phân biệt hoa thường
    }

    // Tìm kiếm với bộ lọc filter
    const tags = await Tag.find(filter);

    // Trả về kết quả
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json(false);
  }
};
