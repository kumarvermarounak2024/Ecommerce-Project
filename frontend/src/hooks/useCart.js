import { useState } from "react";

// Custom hook for cart functionality
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new item, add with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Get cart summary
  const getCartSummary = () => {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const uniqueItems = cartItems.length;

    return {
      totalItems,
      totalPrice,
      uniqueItems,
      isEmpty: cartItems.length === 0,
    };
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getItemQuantity,
    getCartSummary,
  };
};

// Cart helper functions
export const cartHelpers = {
  // Format price with currency
  formatPrice: (price) => {
    return `₹${price.toLocaleString()}`;
  },

  // Calculate discount amount
  calculateDiscount: (originalPrice, currentPrice) => {
    return originalPrice - currentPrice;
  },

  // Calculate discount percentage
  calculateDiscountPercentage: (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  },

  // Check if free shipping is applicable
  isFreeShippingApplicable: (totalPrice, freeShippingThreshold = 999) => {
    return totalPrice >= freeShippingThreshold;
  },

  // Calculate shipping cost
  calculateShipping: (
    totalPrice,
    freeShippingThreshold = 999,
    shippingCost = 50
  ) => {
    return totalPrice >= freeShippingThreshold ? 0 : shippingCost;
  },

  // Generate order summary
  generateOrderSummary: (cartItems) => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = cartHelpers.calculateShipping(subtotal);
    const total = subtotal + shipping;
    const savings = cartItems.reduce((total, item) => {
      if (item.originalPrice) {
        return total + (item.originalPrice - item.price) * item.quantity;
      }
      return total;
    }, 0);

    return {
      subtotal,
      shipping,
      total,
      savings,
      itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    };
  },
};

// Cart validation functions
export const cartValidation = {
  // Validate product before adding to cart
  validateProduct: (product) => {
    const errors = [];

    if (!product.id) errors.push("Product ID is required");
    if (!product.name) errors.push("Product name is required");
    if (!product.price || product.price <= 0)
      errors.push("Valid price is required");
    if (!product.image) errors.push("Product image is required");

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate quantity
  validateQuantity: (quantity, maxQuantity = 10) => {
    if (quantity < 1)
      return { isValid: false, error: "Quantity must be at least 1" };
    if (quantity > maxQuantity)
      return { isValid: false, error: `Maximum quantity is ${maxQuantity}` };
    return { isValid: true, error: null };
  },

  // Check stock availability (mock function)
  checkStock: (productId, requestedQuantity = 1) => {
    // This would typically make an API call to check stock
    // For now, we'll assume all items are in stock
    return {
      inStock: true,
      availableQuantity: 100, // Mock available quantity
      message: "In stock",
    };
  },
};

export default useCart;
