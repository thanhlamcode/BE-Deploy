import Review from "../../models/review.model.js";

const reviewController = {
  // [GET] /reviews/:id
  showReviews: async (req, res) => {
    try {      
      const reviews = await Review.find({ spec: req.params.id });

      res.status(200).json(reviews);
    } catch (err) {
      return res.status(500).json(false);
    }
  },

  // [DELETE] /reviews/:id
  delReviews: async (req, res) => {
    try {
      const detailReviews = await Review.findByIdAndDelete(req.params.id);

      res.status(200).json(true);
    } catch (err) {
      return res.status(500).json(false);
    }
  },

  // [GET] /reviews/search/:id
  searchReviews: async (req, res) => {
    try {
      const reviews = await Review.find({ spec: req.params.id });

      const search = req.query.search || "";

      let sort = req.query.sort || "star";

      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      let sortBy = {};
      if (sort[1]) {
        sortBy[sort[0]] = sort[1];
      } else {
        sortBy[sort[0]] = "asc"; // Mặc định sắp xếp tăng dần
      }

      // Lọc các reviews dựa trên từ khóa tìm kiếm (description)
      let filteredReviews = reviews.filter((review) =>
        review.description.toLowerCase().includes(search.toLowerCase())
      );

      // Sắp xếp các review dựa trên điều kiện sort
      filteredReviews.sort((a, b) => {
        if (sortBy[sort[0]] === "asc") {
          return a[sort[0]] > b[sort[0]] ? 1 : -1;
        } else {
          return a[sort[0]] < b[sort[0]] ? 1 : -1;
        }
      });

      // Trả về các reviews đã được lọc và sắp xếp
      return res.status(200).json(filteredReviews);
    } catch (err) {
      return res.status(500).json(false);
    }
  },
};

export default reviewController;
