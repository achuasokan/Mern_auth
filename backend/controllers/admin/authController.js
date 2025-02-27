import { errorHandler } from '../../utils/error.js'
import jwt from 'jsonwebtoken'
import userModel from '../../models/User.js'


//* //  //  //   //  //          Post Admin Login       //  //  //  //  //  //  //

export const postAdminLogin = async (req,res) => {
  try {
    const { email, password  } = req.body;

    if (email === process.env.admin_Email && password === process.env.admin_Password) {
      
      const accessToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET)
      const refreshToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {expiresIn: '7d'})
      const expiryDate = new Date(Date.now() + 3600000); //~ Setting token expiry to 1 hour
      res.cookie('access_token', accessToken, {httpOnly: true, expires: expiryDate })

      res.cookie('refresh_token', refreshToken, {httpOnly: true, expires: new Date(Date.now() + 604800000)})
      return res.status(200).json({ success: true, accessToken,refreshToken })
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
    res.status(200).json({success:true,users})
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


export const refreshToken = async(req,res) => {
  const refreshToken = req.cookies.refresh_token
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token not found' });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('access_token', newAccessToken, { httpOnly: true, expires: new Date(Date.now() + 3600000) }); 

    return res.status(200).json({ success: true, accessToken: newAccessToken });
  })
  
}


export const logout = () => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  return res.status(200).json({success: true, message: 'Logged out Successfully'})
}