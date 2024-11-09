import wishList from "../../models/wishlist.model.js";

const wishListController = {
  // [POST] /client/wishList/add-to-wishList
  addToWishList: async (req, res) => {
    try {
      const clientId = req.params.id;
      const productId = req.body.productId;

      const myWishList = await wishList.findOne({
        client: {
          _id: clientId,
        },
      });

      const isExist = myWishList.products.some(
        (_product) => _product.toString() === productId
      );

      if (isExist) {
        return res.status(400).json(false);
      }

      myWishList.products.push(productId);

      await myWishList.save();

      res.status(200).json(myWishList);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [PATCH] client/wishList/my-wishList/del-from-wishList
  delfromWishList: async (req, res) => {
    try {
      const result = await wishList.findOneAndUpdate(
        {
          client: req.params.id,
        },
        {
          $pull: {
            products: req.body.productId,
          },
        }
      );

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] client/wishList/my-wishList
  showWishList: async (req, res) => {
    try {
      const products = await wishList
        .find({
          client: req.params.id,
        })
        .populate("products");

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(false);
    }
  },

  // [GET] client/wishList/my-wishList/:id/search
  searchWishList: async (req, res) => {
    try {
      const search = req.query.search || "";

      let sort = req.query.sort || "productName";

      // Cấu trúc dữ liệu sắp xếp (tăng dần hoặc giảm dần)
      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      let sortBy = {};
      if (sort[1]) {
        sortBy[sort[0]] = sort[1];
      } else {
        sortBy[sort[0]] = "asc"; // Mặc định sắp xếp tăng dần
      }

      const wishListData = await wishList
        .findOne({
          client: req.params.id,
        })
        .populate("products");

      const products = await wishListData.products.filter((product) => {
        return (
          product.productCode.match(new RegExp(search, "i")) ||
          product.productName.match(new RegExp(search, "i")) ||
          product.description.match(new RegExp(search, "i"))
        );
      });

      products.sort((a, b) => {
        if (sortBy[sort[0]] === "asc") {
          return a[sort[0]].localeCompare(b[sort[0]]);
        } else {
          return b[sort[0]].localeCompare(a[sort[0]]);
        }
      });

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(false);
    }
  },
};

export default wishListController;
