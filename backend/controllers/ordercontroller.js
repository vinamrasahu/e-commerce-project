import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {

    console.log("===== REQ BODY =====");
    console.log(JSON.stringify(req.body, null, 2));

    const { items, shippingAddress, totalPrice, paymentMethod } = req.body; 

    console.log("User from token:", req.user);

    const order = await Order.create({
      user: req.user.id,
      
      items,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });

    console.log("Saved Order:", order);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product");
  
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const getOrderById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const order = await Order.findById(id)
        .populate("user", "name email")
        .populate("items.product");
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
  
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };




  export const getMyOrders = async (req, res) => {
    try {
      const orders = await Order.find({
        user: req.user.id,
      })
        .populate("items.product")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };