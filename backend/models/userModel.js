import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    //if all you wanted was 1 thing, you'd just use a key: value pair
    //but we want a couple of things like name & required so we use a nested object instead:
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    //mongoose has this 2nd parameter object like for created at w/ time
    timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User