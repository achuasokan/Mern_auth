import userModel from '../../models/User.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../../utils/error.js'
import jwt from 'jsonwebtoken'


//* //  //  //   //  //          POST SIGNUP    //  //  //  //  //  //  //

export const signUp = async(req, res, next) => {
  try {
    const {username, email, password} = req.body

      // Validation
      if (!username || !email || !password) {
        return next(errorHandler(400, 'All fields are required.'));
      }
  

      const namepattern = /^(?! )[A-Za-z ]{3,20}$/;
      const emailpattern=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s)[A-Za-z\d!@#$%^&*]{6,}$/;

      if(!namepattern.test(username)) {
        return next(errorHandler(400,'Name must be between 3 to 20 characters long and contain only alphabets.'))
      } else if(!emailpattern.test(email)) {
        return next(errorHandler(400,'Please enter a valid email address'))
      } else if(!passwordpattern.test(password)) {
        return next(errorHandler(400,'Password must be at least 6 characters long, include upper and lower case letters, a digit and a special character.'))
      }
  
      const existingUser = await userModel.findOne({ 
        $or: [
          { email },
          { username }
        ]
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return next(errorHandler(400, 'Email is already in use.'));
        }
        return next(errorHandler(400, 'Username is already taken. Try a different one.'));
      }

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

    if(validUser.blocked) {
      return next(errorHandler(400,'You account has been blocked.Please contact support'))
    }

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


//* //  //  //   //  //          Google Auth     //  //  //  //  //  //  //

export const google = async (req,res,next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email})

    if(user) {

      if(user.blocked) {
        return next(errorHandler(403,'Your account has been blocked. please contact support'))
      }

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


//* //  //  //   //  //          Signout    //  //  //  //  //  //  //

export const signout = (req,res) => {
  res.clearCookie('access_token').status(200).json('signout successfully')
}