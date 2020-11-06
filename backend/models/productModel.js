import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
    //this Schema is for the individual review rating for each User
    // the review on the productSchema is the average review out of all the submitted reviews from Users
    name: {
        type: String,
        required: true
    },
    user: {//we add user here to associate a user to a review b/c we want to implement checking that if the user already added a review so we don't duplicate a review
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
}, { timestamps: true })

const productSchema = mongoose.Schema({
    user: {
        // if we have more than 1 admin, we want to know which admin created which product:
        type: mongoose.Schema.Types.ObjectId,//gets the user id from the database
        required: true,
        ref: 'User'//to reference the specific model for the object id above/also adds a relationship between the product & the user
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: [reviewSchema],//an array of review objects (from a separate Schema)
    rating: {//average rating of all the ratings in the reviews
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    //mongoose has this 2nd parameter object like for created at w/ time
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product