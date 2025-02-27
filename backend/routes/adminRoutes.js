import express from 'express'
import * as authController from '../controllers/admin/authController.js'
import { verifyAdmin } from '../utils/verifyAdmin.js'
const router = express.Router()




//^  //  //  //  //  //  //                Admin Auth routes             //  //  //  //  //  //  //

router.post('/login',authController.postAdminLogin)
router.get('/users', verifyAdmin, authController.getAllUsers)
router.patch('/toggle-block/:id', verifyAdmin, authController.toggleUserBlock)

export default router