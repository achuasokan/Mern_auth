import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

//? dotenv config
dotenv.config();

//? database connection
connectDB();

//? create express app
const app = express()

//? middleware
app.use(express.json());                                                                        //~parse json
app.use(express.urlencoded({extended:false}));   

//? importing the routes
import userRouter from './routes/userRoutes.js'
import authRouter from './routes/authRoutes.js'

//? routes
app.use('/api/user',userRouter) 
app.use('/api/auth',authRouter)

//? error handling middleware
app.use((err, req, res, next) => {
  const statuscode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  return res.status(statuscode).json({
    success: false,
    message,
    statuscode
  })
})

//?port
const port=process.env.PORT || 3000


//?starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})