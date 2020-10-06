import express from 'express'
import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

const router = express.Router()

// Description: fetch all products
// Route: GET /api/products
// Access: Public

// here we don't need /api/products anymore since we're gonna route to products w/ this file
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({})//this returns a promise so we need to use either async/await or try/then
    res.json(products)
}))

// Description: fetch single product
// Route: GET /api/products/:id
// Access: Public

// here we don't need /api/products/ anymore
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        //404 error is not found
        res.status(404)
        throw new Error('Product not found. ')
    }
}))

export default router