import userModel from '../../models/User.js'
import bcryptjs from 'bcryptjs'

export const signup = async(req, res) => {
  try {
    const {username, email, password} = req.body

    //~ Hash the password 
  const hashedPassword = bcryptjs.hashSync(password, 10)

    await userModel.create({
      username,
      email,
      password:hashedPassword
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
}