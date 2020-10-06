import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()
connectDB()

const importData = async () => {
    try {
        //to clear all
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)
        const adminUser = createdUsers[0]._id// we want the 1st item so[0] & _id for the admin in the users file                                                    ff]
        const sampleProducts = products.map(product => {
            return {
                //to add adminUser to each product for the sampleProducts
                ...product,
                user: adminUser
            }
        })
        //take the Product model & pass in sampleProducts (w/ all the product data including the admin user)
        await Product.insertMany(sampleProducts)
        console.log('Data imported!'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        //to clear all
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data Destroyed!'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

//we create a script in package.json call either of these functions from the terminal
// via npm run data:import or npm run data:destroy, you can then check the mongodb compass app to see the results
if(process.argv[2] === '-d'){
    destroyData()
} else {
    importData()
}
//this is to run initially & get some data, not for when you have products & add more. 
//If you run the import it'll replace everything & destroying will also affect everything (even the users)
//you might want to even delete this if you want