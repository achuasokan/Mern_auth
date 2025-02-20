import userModel from '../../models/User.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../../utils/error.js'
import jwt from 'jsonwebtoken'


//* //  //  //   //  //          POST SIGNUP    //  //  //  //  //  //  //

export const signUp = async(req, res, next) => {
  try {
    const {username, email, password} = req.body

    //~ Hash the password 
  const hashedPassword = bcryptjs.hashSync(password, 10)

  //~ creating a new user in the database
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


//* //  //  //   //  //          POST SIGNIN     //  //  //  //  //  //  //

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await userModel.findOne({ email });

    if (!validUser) return next(errorHandler(404, 'User not found'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong Credentials'));

    //~ Generating a JWT token for the user
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: hashedPassword, ...rest } = validUser._doc; //~ Excluding the password from the response
    const expiryDate = new Date(Date.now() + 3600000); //~ Setting token expiry to 1 hour

    //~ Setting the cookie with the token
    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200).json(rest);

  } catch (error) {
    next(error); 
  }
};


export const google = async (req,res,next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email})

    if(user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      
    const { password: hashedPassword, ...rest } = user._doc; //~ Excluding the password from the response
    const expiryDate = new Date(Date.now() + 3600000); //~ Setting token expiry to 1 hour

    //~ Setting the cookie with the token
    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest)
    } else {
      const generatedPassword= Math.random().toString(36).slice(-8)
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

      const newUser = new userModel({
        username: req.body.name.split(" ").join('').toLowerCase() + Math.floor(Math.random() * 10000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo
      })

      await newUser.save()

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      
    const { password: hashedPassword2, ...rest } = newUser._doc; //~ Excluding the password from the response
    const expiryDate = new Date(Date.now() + 3600000); //~ Setting token expiry to 1 hour

    //~ Setting the cookie with the token
    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest)

    }

  } catch (error) {
    next(error)
  }
}