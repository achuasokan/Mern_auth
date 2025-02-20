import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type:String,
    required: true,
    unique: true
  },
  email: {
    type:String,
    required:true,
    unique: true,
  },
  password: {
    type:String,
    required:true
  },
  profilePicture: {
    type:String,
    default:'https://www.google.com/imgres?q=anime%20profile%20picture&imgurl=https%3A%2F%2Fi.pinimg.com%2F736x%2Ffa%2Fd5%2Fe7%2Ffad5e79954583ad50ccb3f16ee64f66d.jpg&imgrefurl=https%3A%2F%2Fin.pinterest.com%2Fsarcaeus%2Fanime-profile-pictures%2F&docid=3ZCATee704do4M&tbnid=DBvkPISiKmlH7M&vet=12ahUKEwilgZjQhtOLAxX0SmwGHUVEGnkQM3oECBoQAA..i&w=736&h=736&hcb=2&itg=1&ved=2ahUKEwilgZjQhtOLAxX0SmwGHUVEGnkQM3oECBoQAA'
  }
}, {timestamps: true})

const User= mongoose.model('User',userSchema)

export default User