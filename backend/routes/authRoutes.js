import express from 'express'
import * as authController from '../controllers/user/authController.js'
const router = express.Router()

router.post('/signup',authController.signUp)
router.post('/signin',authController.signIn)
router.post('/google',authController.google)
router.post('/signout',authController.signout)
export default router