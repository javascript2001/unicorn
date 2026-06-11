import express from 'express'
import { Router } from 'express'
import { register_controller, login_controller, verify_controller, resend_verification_controller, logout_controller, profilePicture_controller } from '../controller/auth.controller.js'
import { isLogin } from '../middleware/islogin.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
const authRouter = Router();

authRouter.post('/register', register_controller)
authRouter.post('/login', login_controller)
authRouter.get('/verify', verify_controller)
authRouter.post('/resend-verification-mail', resend_verification_controller)
authRouter.post('/logout', logout_controller)

// file error handling
authRouter.post('/upload/profilePicture', isLogin, (req,res,next) => 
    {upload.single('img')(req, res, (err) => {
    if (err) {
        return res.status(400).json({
            success: false,
            message: "Make sure file is Img and File size is under 5MB",
            err: err
        })
    }
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "File is requried"
        })
    }
    // console.log(req.file);
    next()
})
}, profilePicture_controller)

export { authRouter };