const isLogin = (req, res, next) => {
    if (req.cookies && req.cookies.token) {
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Please log in to access this resource.'
        }); 
    }
}

export {isLogin}