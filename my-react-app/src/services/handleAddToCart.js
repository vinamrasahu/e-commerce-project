import { addToCart } from "./cartService";

const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
      });
  
      alert("Product added to cart");
    } catch (error) {
      console.error(error);
    }
  };