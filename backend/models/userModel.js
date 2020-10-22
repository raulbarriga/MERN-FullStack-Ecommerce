import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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

//we can create methods that we can call later on through these model files
userSchema.methods.matchPassword = async function(enteredPassword) {
    //await since this returns a promise
    return await bcrypt.compare(enteredPassword, this.password)//compares the plain text to the encrypted password (this.password)
}

//separating this hashing middleware here from the controller frees it up & makes the controller more clear
userSchema.pre('save', async function(next) {// ********
    //we only want to hash the password IF it's sent or modified
    if(!this.isModified('password')) {//this covers the case when we update our profile's name, etc. but not the password; if the profile's updated, we don't want to hash the password again, otherwise we won't be able to login.
        // if the password hasn't been modified, go to the next process
        next()
    }

    //*************here we want to encrypt the password***************
    //'save' means that this middleware gets before we actually save
    const salt = await bcrypt.genSalt(10)//takes in a # of rounds, this salt will hash the password

    //this refers to the user that we're creating on register
    this.password = await bcrypt.hash(this.password, salt)//initially, this.password was in plain text, but here we're resetting it to be a hashed password
})//this should automatically run (we don't have to import it to our userController, etc.)

const User = mongoose.model('User', userSchema)

export default User