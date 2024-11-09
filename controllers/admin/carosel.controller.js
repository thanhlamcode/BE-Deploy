import Carousel from "../../models/carousel.model.js";

// Middleware
import deleteFromDrive from "../../middleware/delToDrive.js";

const carouselController = {
  // [POST] /carousel/
  addCarousel: async (req, res) => {
    try {
      const _slug = req.body.slug;

      const isExist = await Carousel.findOne({ _slug });

      if (isExist) {
        return false;
      }

      const carousel = await Carousel({
        title: req.body.title,
        imgUrl: req.imageUrls[0],
        slug: req.body.slug,
      });
      await carousel.save();

      return res.status(200).json(carousel);
    } catch (err) {
      return res.status(500).json(false);
    }
  },

  // [GET] /carousel/
  showCarousel: async (req, res) => {
    try {
      const carousel = await Carousel.find();

      return res.status(200).json(carousel);
    } catch (err) {
      return res.status(500).json(false);
    }
  },

  // [DELETE] /carousel/:id
  delCarousel: async (req, res) => {
    try {
      // Tìm sản phẩm theo ID
      const carosel = await Carousel.findById(req.params.id);

      // Lấy danh sách hình ảnh để xóa
      const urlParams = new URL(carosel.imgUrl);
      const fileId = urlParams.searchParams.get("id");
      if (fileId) {
        // Gọi middleware xóa hình ảnh
        await deleteFromDrive({ params: { fileId: fileId } }, res, () => {});
      }

      await Carousel.findByIdAndDelete(req.params.id);

      return res.status(200).json(true);
    } catch (err) {
      return res.status(500).json(false);
    }
  },

  // [PATCH] /carousel/:id
  updateCarousel: async (req, res) => {
    try {
      const carosel = await Carousel.findById(req.params.id);

      const newImgUrl = req.imageUrls[0];

      if (newImgUrl) {
        // Kiểm tra nếu `carousel.imgUrl` không phải là `null` trước khi xử lý

        console.log("BOdoi: " + carosel.imgUrl);
        if (carosel.imgUrl) {
          const urlParams = new URL(carosel.imgUrl);
          const fileId = urlParams.searchParams.get("id");

          if (fileId) {
            // Gọi middleware xóa hình ảnh từ Google Drive
            await deleteFromDrive(
              { params: { fileId: fileId } },
              res,
              () => {}
            );
          }
        }

        // Gán hình ảnh mới cho `carousel.imgUrl`
        carosel.imgUrl = newImgUrl;
      }

      const result = await Carousel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          imgUrl: carosel.imgUrl, // Cập nhật hình ảnh
        },
        {
          new: true, // Trả về sản phẩm đã cập nhật
        }
      );

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json(false);
    }
  },
};

export default carouselController;
