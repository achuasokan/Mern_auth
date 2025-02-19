import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

//? dotenv config
dotenv.config();

//? database connection
connectDB();

//? create express app
const app = express()



//? importing the routes
import userRouter from './routes/userRoutes.js'

//? routes
app.use('/api/user',userRouter) 


const port=process.env.PORT || 3000


//?starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})