import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  //also check if it starts w/ 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; //'Bearer' is the [0] & the token is the [1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET); //returns an object w/ id, issued at time, & expiration time

      req.user = await User.findById(decoded.id).select("-password"); //the only thing we don't want to return here is the password, so we use .select()
      next();
    } catch (error) {
      console.error(error);

      res.status(401); //unauthorized
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401); //unauthorized
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  // we first check if there's a user logged in w/ req.user & then if that user is an admin w/ req.user.isAdmin
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401); // Not authorized status
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
