import express from 'express'
import * as authController from '../controllers/admin/authController.js'
const router = express.Router()




//^  //  //  //  //  //  //                Admin Auth routes             //  //  //  //  //  //  //

router.post('/login',authController.postAdminLogin)
router.get('/users', authController.getAllUsers)
router.patch('/toggle-block/:id', authController.toggleUserBlock)

export default router