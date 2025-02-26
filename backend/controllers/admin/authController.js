import { errorHandler } from '../../utils/error.js'
import jwt from 'jsonwebtoken'

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
  
