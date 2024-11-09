import Cart from "../models/cart.model.js";
import Voucher from "../models/voucher.model.js";

export const createOrUpdateCart = async (userId, cart) => {
  const oldCart = await Cart.findOne({ client: userId });

  if (oldCart) {
    // Remove duplicate items in the old cart
    cart.cartItems.forEach((newCartItem) => {
      oldCart.cartItems = oldCart.cartItems.filter(
        (oldCartItem) => oldCartItem.spec.toString() !== newCartItem.spec
      );
    });
    await oldCart.save();

    // Create new cart without userId
    const newCart = new Cart({ cartItems: cart.cartItems });
    await newCart.save();
    return newCart;
  } else {
    // Create new cart with userId
    const newCart = new Cart({ client: userId, cartItems: cart.cartItems });
    await newCart.save();
    return newCart;
  }
};

// Helper function to calculate the total price of items in the cart
export const calculateItemsTotal = (cart) => {
  let itemsTotal = 0;
  cart.cartItems.forEach((item) => {
    const price = item.spec.price || 0;
    const discountPercentage = item.spec.discountPercentage || 0;
    const discountedPrice = price * (1 - discountPercentage);
    itemsTotal += item.quantity * discountedPrice;
  });
  return itemsTotal;
};

// Helper function to calculate discount amount from vouchers
export const calculateDiscountAmount = async (voucherIds, itemsTotal) => {
  let discountAmount = 0;
  for (const voucherId of voucherIds) {
    const appliedVoucher = await Voucher.findById(voucherId);
    if (appliedVoucher) {
      const voucherDiscountPercentage = appliedVoucher.discountPercentage || 0;
      const voucherFixedAmount = appliedVoucher.fixedAmount || 0;

      // Calculate discount from voucher, ensuring it does not exceed fixedAmount
      const calculatedDiscount = Math.min(
        itemsTotal * (voucherDiscountPercentage / 100),
        voucherFixedAmount
      );

      // Accumulate discountAmount from each voucher
      discountAmount += calculatedDiscount;
    }
  }
  return discountAmount;
};
