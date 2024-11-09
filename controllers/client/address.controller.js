import AccountModel from "../../models/account.model.js";
import Address from "../../models/address.model.js";

// [GET] /client/address
export const index = async (req, res) => {
  try {
    const accountId = req.params.accountId;

    const address = await Address.find({ accountId: accountId });

    res.json(address);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [POST] /client/address/add
export const post = async (req, res) => {
  try {
    console.log(req.body);

    // Lấy accountId từ request body (hoặc từ req.params nếu cần)
    const { accountId, ...addressData } = req.body;

    // Tạo bản ghi mới cho địa chỉ, bao gồm accountId
    const record = new Address({ accountId, ...addressData });

    // Lưu địa chỉ mới
    await record.save();

    // Thêm ObjectId của địa chỉ vào mảng addresses trong tài khoản
    await AccountModel.updateOne(
      { _id: accountId },
      {
        $push: {
          addresses: record._id, // Thêm ObjectId của địa chỉ vào mảng addresses
        },
      }
    );

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [PATCH] /client/address/edit/:id
export const edit = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Address.findByIdAndUpdate({ _id: id }, req.body);

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json(false);
  }
};

// [DELETE] /client/address/delete/:id
export const deleteAddress = async (req, res) => {
  try {
    // Tìm địa chỉ cần xóa
    const address = await Address.findOne({ _id: req.params.id });

    if (!address) {
      return res.status(404).json(false);
    }

    // Xóa ObjectId của địa chỉ khỏi tài khoản
    await AccountModel.updateOne(
      { _id: address.accountId },
      {
        $pull: {
          addresses: address._id, // Sử dụng _id của địa chỉ
        },
      }
    );

    // Xóa địa chỉ
    await Address.deleteOne({ _id: req.params.id });

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json(false);
  }
};
