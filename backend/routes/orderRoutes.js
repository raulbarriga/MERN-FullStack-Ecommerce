//after the order's created in the db, we'll be sent to a specific order page on the frontend, order/whatever the id is
//that's the page where we want to have the paypal button & things like that
import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliver,
  getMyOrders,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById); //this has to go under the 1st one since the path has the 1st one's path ('/') plus the id
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDeliver);

export default router;
