import express from 'express'
import * as userControl from '../controllers/user/userController.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()

router.get('/',userControl.Home)
router.post('/update/:id', verifyToken, userControl.update)
router.delete('/delete/:id',verifyToken, userControl.deleteUser)



export default router