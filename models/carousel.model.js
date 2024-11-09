import mongoose from "mongoose";

const carouselSchema = mongoose.Schema({
  title: {
    type: String,
    required: true, // Bắt buộc
  },
  imgUrl: {
    type: String,
    required: true, // Bắt buộc
  },
  slug: {
    type: String,
    unique: true, // Không được trùng
  },
});

const Carousel = mongoose.model("carousel", carouselSchema, "carousels");
export default Carousel;
