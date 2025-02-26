import { errorHandler } from '../../utils/error.js'
import jwt from 'jsonwebtoken'
import userModel from '../../models/User.js'


//* //  //  //   //  //          Post Admin Login       //  //  //  //  //  //  //

export const postAdminLogin = async (req,res) => {
  try {
    const { email, password  } = req.body;

    if (email === process.env.admin_Email && password === process.env.admin_Password) {
      
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {expiresIn: '1h'})
      return res.status(200).json({ success: true, token })
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
   
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error'})
  }
  } 


//* //  //  //   //  //          GET USER LIST       //  //  //  //  //  //  //

export const getAllUsers = async (req,res,next) => {
  try {
    const users = await userModel.find().lean()
    console.log(users)
    res.status(200).json(users)
  }catch (error) {
    next(error)
  }
}


//* //  //  //   //  //          Block & Unblock the users      //  //  //  //  //  //  //

export const toggleUserBlock = async (req,res,next) => {
  try {
    const userId = req.params.id
    const user = await userModel.findById(userId)

    if(!user) {
      return next(errorHandler(403,'User not found'))
    }

    user.blocked = !user.blocked
    await user.save()
    const message = user.blocked ? 'User Blocked successfully' : 'User unBlocked successfully'
    res.status(200).json({ success: true, message})
  }catch (error) {
    next(error)
  }
} 