import Review from "../../models/review.model.js";
import Order from "../../models/order.model.js";
import Cart from "../../models/cart.model.js";

const reviewController = {
  // [POST] /client/reviews/:id
  addReviews: async (req, res) => {
    try {
      const order = await Order.findOne({
        userId: req.body.clientId,
      });

      console.log("Order: " + order);

      const cart = await Cart.findById(order.cart).populate("cartItems.spec");

      console.log("CartItems:", cart.cartItems);

      if (!order || !cart) {
        return res.status(400).json({ message: false });
      }

      const specInCart = cart.cartItems.some((item) => {
        return item.spec._id.toString() === req.params.id;
      });

      console.log("Spec: " + specInCart);

      if (!specInCart) {
        return res.status(400).json({ message: false });
      }

      const review = new Review({
        clientId: req.body.clientId,
        spec: req.params.id,
        description: req.body.description,
        star: req.body.star,
      });

      await review.save();

      return res.status(200).json(review);
    } catch (err) {
      return res.status(500).json(false);
    }
  },

  // [DELETE] /client/reviews/:id
  delReviews: async (req, res) => {
    try {
      await Review.findByIdAndDelete(req.params.id);

      res.status(200).json(true);
    } catch (err) {
      return res.status(500).json(false);
    }
  },

  // [PATCH] /client/reviews/:id
  updateReviews: async (req, res) => {
    try {
      const allowedUpdates = ["description", "star"];

      const updates = Object.keys(req.body);
      const isValid = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValid) {
        return res.status(400).json({ message: fals });
      }

      const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      return res.status(200).json(review);
    } catch (err) {
      return res.status(500).json(false);
    }
  },
};

export default reviewController;
