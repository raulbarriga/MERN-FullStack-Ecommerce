import express from 'express'
import { getProductById, getProducts } from '../controllers/productController.js'

const router = express.Router()

// here we don't need /api/products anymore since we're gonna route to products w/ this file
router
    .route('/')
    .get(getProducts)

// here we don't need /api/products/ anymore
router
    .route('/:id')
    .get(getProductById)

export default router