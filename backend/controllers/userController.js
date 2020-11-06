import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";

// Description: 1st) Authenticate the user & send back a data token to save on the client & use to access protected routes
// Route: POST /api/users/login
// Access: Public
const authUser = asyncHandler(async (req, res) => {
  //1st) get data from the body via Postman to mimic sending a form0
  //The JSON email & password on the Postman body'll be received here via req.body
  const { email, password } = req.body;

  const user = await User.findOne({
    //find one document, & find it by:
    email, // w/ ES6 it's basically email: email
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); //unauthorized

    throw new Error("Invalid email or password");
  }
});

// Description: Get user profile
// Route: GET /api/users/profile
// Access: Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  res.send("success");
});

// Description: Update user profile
// Route: PUT /api/users/profile
// Access: Private
const updateUserProfile = asyncHandler(async (req, res) => {
  //req.user._id is coming from the logged in user
  const user = await User.findById(req.user._id);
  if (user) {
    //if it's in the request then it'll be updated by req.body.whatever, otherwise it stays the same/doesn't update
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    //for password, first check if the password was sent:
    if (req.body.password) {
      //checking if the password was sent
      //it'll be auto enccrypted b/c of what we did in the model
      user.password = req.body.password;
    }

    const updatedUser = await user.save(); //we save the user's info
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  res.send("success");
});

// Description: Register a new user
// Route: POST /api/users
// Access: Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({
    email,
  });

  if (userExists) {
    res.status(400); //if user already exists, then throw a 400 error, which means a bad request
    throw new Error("User already exists.");
  }
  const user = await User.create({
    name,
    email,
    password, //right now this password is plain text, but we'll get to the encryption part in a little bit
  });

  if (user) {
    //201 means something was created, 200 means it was a success
    res.status(201).json({
      //we send this data back, the same data from the login b/c we want to authenticate right after we register (log the person in when they create their new account)
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Description: Get all users
// Route: GET /api/users
// Access: Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // we pass in an empty object b/c we want to get all users
  const users = await User.find({});

  res.json(users);
});

// Description: Delete user
// Route: DELETE /api/users/:id
// Access: Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // we pass in an empty object b/c we want to get all users
  const user = await User.findById(req.params.id);

  if (user) {
    // 1) check if the user exists, if he does we remove him
    await user.remove();
    res.json({ message: "User removed." });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// Description: Get user by ID
// Route: GET /api/users/:id
// Access: Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// Description: Update user
// Route: PUT /api/users/:id
// Access: Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  //req.user._id would be from the logged in user, req.params.id is from the user's info in the database
  const user = await User.findById(req.params.id);

  if (user) {
    //these are the things that are getting updated
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    //We won't be able to change the user's password though
    user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;// this code came from the Q&A section of the udemy course from a response by Bassir to a question.

    const updatedUser = await user.save(); //we save the user's info
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
