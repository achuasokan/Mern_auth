import User from '../../models/User.js';
import { errorHandler } from '../../utils/error.js'
import bcryptjs from 'bcryptjs';

export const Home = async(req,res) => {
  try {
    res.json('Home')
  } catch(error) {
    console.log(error);
    res.status(500).send('Internal server error')
  }
}


//* //  //  //   //  //          Updating user profile      //  //  //  //  //  //  //

export const update = async (req, res, next) => {
  
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


//* //  //  //   //  //          Deleting a user     //  //  //  //  //  //  //

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }

}