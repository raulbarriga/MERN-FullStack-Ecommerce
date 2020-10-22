import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    //payload is the object w/ id & the 2nd argument is the secret, which we put in our .env file
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '30d'})//30d is 30 days
}

export default generateToken