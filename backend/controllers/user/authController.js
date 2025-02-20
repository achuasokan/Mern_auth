import userModel from '../../models/User.js'
import bcryptjs from 'bcryptjs'

export const signup = async(req, res, next) => {
  try {
    const {username, email, password} = req.body

    //~ Hash the password 
  const hashedPassword = bcryptjs.hashSync(password, 10)

    await userModel.create({
      username,
      email,
      password:hashedPassword
    })
    res.status(201).json({message: "User created successfully"})
    
  } catch (error) {
    next(error)
  }
}