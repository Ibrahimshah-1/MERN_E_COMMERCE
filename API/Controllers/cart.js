import { Cart } from "../Models/Cart.js";
import { Products } from "../Models/Products.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const userId = req.user._id;

    // Check quantity
    if (!qty || qty < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
        success: false,
      });
    }

    // Find actual product
    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    // Check stock
    if (product.qty < qty) {
      return res.status(400).json({
        message: "Not enough stock available",
        success: false,
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create it
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    // Check whether product already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].qty + qty;

      // Check stock again for total quantity
      if (newQty > product.qty) {
        return res.status(400).json({
          message: "Not enough stock available",
          success: false,
        });
      }

      cart.items[itemIndex].qty = newQty;

      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        qty,
        imgSrc: product.imgSrc,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Item added to cart",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Add to cart error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//get user cart

export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        success: true,
        cart: {
          userId,
          items: [],
        },
      });
    }

    return res.status(200).json({
      message: "User cart",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Get cart error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//remove product from cart

export const removeProductFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "No cart found",
        success: false,
      });
    }

    // Check whether product exists in cart
    const itemExists = cart.items.some(
      (item) => item.productId.toString() === productId,
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    // Remove product
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    // Save updated cart
    await cart.save();

    return res.status(200).json({
      message: "Product removed from cart",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Remove product from cart error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//clear cart

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "No cart found",
        success: false,
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared",
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Clear cart error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// decrease qty from cart

export const decreaseProductQty = async (req, res) => {

    try {

        const { productId, qty } = req.body;

        const userId = req.user._id;

        // Check quantity
        if (!qty || qty < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1",
                success: false
            });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        // Find product inside cart
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart",
                success: false
            });
        }

        const item = cart.items[itemIndex];

        // If removing all requested quantity
        if (item.qty <= qty) {
            cart.items.splice(itemIndex, 1);
        } else {
            item.qty -= qty;
        }

        await cart.save();

        return res.status(200).json({
            message: "Cart quantity decreased",
            success: true,
            cart
        });

    } catch (error) {

        console.log("Decrease cart quantity error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};