import express from 'express'
import * as userControl from '../controllers/user/userController.js'

const router = express.Router()

router.get('/',userControl.Home)




export default router