import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

// Description: Create new order
// Route: POST /api/orders
// Access: Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400); //bad request
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id, // b/c this is a protected route & thus we'll get a token that'll inc;ude the user id
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save(); // to save this newly created order in the database

    res.status(201).json(createdOrder); // success message b/c something was created
  }
});

// Description: Get order by id
// Route: GET /api/orders/:id
// Access: Private
const getOrderById = asyncHandler(async (req, res) => {
  // populate from 'user' & 'name' & 'email', space separated will also be attached to findById
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  // check if the order exists
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found.");
  }
});

// Description: Update order to paid
// Route: PUT /api/orders/:id/pay
// Access: Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  // check if the order exists
  if (order) {
    order.isPaid = true; //false by default
    order.paidAt = Date.now();
    order.paymentResult = {
      //this is gonna come from the PayPal response
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address, //email is in a payer object
    }; //if you add another payment gateway, you'll probably have to add more info than this

    const updatedOrder = await order.save(); //we still have to save this paypal stuff here
    res.json(updatedOrder); //sending back the updated order
  } else {
    res.status(404);
    throw new Error("Order not found.");
  }
});

// Description: Update order to 'out for delivery'
// Route: PUT /api/orders/:id/deliver
// Access: Private/Admin
const updateOrderToDeliver = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  // check if the order exists
  if (order) {
    // 'isDelivered' just means 'out for delivery', not that it's been received by the buyer
    order.isDelivered = true; //false by default
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save(); //we still have to save this paypal stuff here
    res.json(updatedOrder); //sending back the updated order
  } else {
    res.status(404);
    throw new Error("Order not found.");
  }
});

// Description: Get logged in user orders
// Route: GET /api/orders/myorders
// Access: Private
const getMyOrders = asyncHandler(async (req, res) => {
  //we're getting more than 1 so we use find()
  const orders = await Order.find({ user: req.user._id }); // we only want find orders where the user = req.user._id

  res.json(orders);
});

// Description: Get all orders
// Route: GET /api/orders
// Access: Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name"); // we only want find orders where the user = req.user._id

  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliver,
  getMyOrders,
  getOrders
};
