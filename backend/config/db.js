import mongoose from 'mongoose'

const connectDB = async () => {
    // when we call .connect or .find, .create, etc. it's always gonna return a promise so we're gonna return async/await
    try {
        //takes in a URI
        const conn = await mongoose.connect( process.env.MONGO_URI, {
            //have to set this 2nd parameter to remove warnings from browser
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        } )

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(`Error: ${error.message}`.red.underline.bold)
        process.exit(1)
    }

}

export default connectDB