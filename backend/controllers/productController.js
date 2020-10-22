import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

// Description: fetch all products
// Route: GET /api/products
// Access: Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})

    res.json(products)
})

// Description: fetch single product
// Route: GET /api/products/:id
// Access: Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        //404 error is not found
        res.status(404)
        throw new Error('Product not found. ')
    }

})

export { getProducts, getProductById }

// So a controller(s) is pretty much the function that'll get called in the route file & the route path.