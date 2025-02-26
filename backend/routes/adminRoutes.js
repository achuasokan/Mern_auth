import express from 'express'
import * as authController from '../controllers/admin/authController.js'
const router = express.Router()




//^  //  //  //  //  //  //                Admin Auth routes             //  //  //  //  //  //  //

router.post('/login',authController.postAdminLogin)

export default router