import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const isLogin = (req, res, next) => {
    if (req.cookies && req.cookies.token) {
        req.userId = jwt.verify(req.cookies.token, process.env.JWT_SECRET).userId;
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Please log in to access this resource.'
        }); 
    }
}

export {isLogin}