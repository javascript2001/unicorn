import express from 'express'
import { Router } from 'express'
import {register_controller, login_controller, verify_controller, resend_verification_controller} from '../controller/auth.controller.js'
import { isLogin } from '../middleware/islogin.middleware.js'
const authRouter = Router();

authRouter.post('/register', register_controller)
authRouter.post('/login', login_controller)
authRouter.get('/verify', verify_controller)
authRouter.post('/resend-verification-mail', resend_verification_controller)

export {authRouter};