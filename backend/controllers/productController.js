import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// Description: fetch all products
// Route: GET /api/products
// Access: Public
const getProducts = asyncHandler(async (req, res) => {
  //to test the functionality of pagination, we can just go to http://localhost:3000/page/# and for # just use +2 to list the next products list page
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1; //if it's not included, then we're on page 1

  const keyword = req.query.keyword
    ? {
        //this'll test for the keyword w/ req/query (for ?= or ?something=)
        name: {
          $regex: req.query.keyword, //this is to have search results for even 'iph' instead of the exact word 'iphone'
          $options: "i", //for case-insensitive
        },
      }
    : {}; //if it doesn'x exist as a product or an empty string

  //Count for product search results, used for pagination
  const count = await Product.countDocuments({ ...keyword });
  //skip is used to see which products we get for pagination

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1)); //if {} is empty, it'll fetch all the products

  //since at first this wasn't returning an {}, we have to account for that in the frontend to get rid of the {} error
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// Description: fetch single product
// Route: GET /api/products/:id
// Access: Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    //404 error is not found
    res.status(404);
    throw new Error("Product not found. ");
  }
});

// Description: Delete a product
// Route: DELETE /api/products/:id
// Access: Public/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    //check if the product exists by that id from above
    //since we don't add a check if the user is an admin here, any admin can come in & delete a product
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    //404 error is not found
    res.status(404);
    throw new Error("Product not found. ");
  }
});

// Description: Create a product
// Route: POST /api/products
// Access: Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id, //the logged in user
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Description: Update a product
// Route: PUT /api/products/:id
// Access: Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id); //id is in the url so you use req.params

  if (product) {
    //find the product
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found. ");
  }
});

// Description: Create a new review
// Route: POST /api/products/:id/reviews
// Access: Private
const createProductReview = asyncHandler(async (req, res) => {
  const {
    //for any particular review
    rating,
    comment,
  } = req.body;

  const product = await Product.findById(req.params.id); //id is in the url so you use req.params

  if (product) {
    //find the product, if it exists, we check to see if the user's already submitted a review:
    // in review.user, user is from the Model review schema
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed. ");
    }

    const review = {
      name: req.user.name, //the logged in user's name
      rating: Number(rating), //coming from the destructured body of the request above
      comment,
      user: req.user._id,
    };

    //our array of reviews is products.reviews
    product.reviews.push(review); //we push/add the new review
    //then we update this:
    product.numReviews = product.reviews.length; //this'll update the # of reviews field
    //this is for the overall rating, not for each individual review for from a product; we add the accumulator which starts @ 0
    product.rating =
      product.reviews.reduce(
        (accumulator, currentItem) => currentItem.rating + accumulator,
        0
      ) / product.reviews.length; //divide by total length of reviews

    await product.save(); //this'll add the fields to the database

    //201 status is for when something was created successfully
    res.status(201).json({ message: "Review added." });
  } else {
    res.status(404);
    throw new Error("Product not found. ");
  }
});

// Description: Get top rated products
// Route: GET /api/products/top
// Access: Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3); //if you want to show more than 3 products in the carousel, you can change this here

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};

// So a controller(s) is pretty much the function that'll get called in the route file & the route path.
