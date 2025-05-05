import jwt from 'jsonwebtoken'

const authMiddleware = async (req , res , next) => {
    const { token } = req.headers ;
    if (!token) {
        return res.json({  success : false , message: 'Not Authorized Login Again' });
    }

    try {
        const token_decoded = jwt.verify( token , process.env.JWT_SECRET);
        //console.log('Token decoded:', token_decoded);
        //req.body.userId = token_decoded.id ;
        req.user = { userId: token_decoded.id }; // best pratice in controllers
        next();
    } 
    catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'Error' });
    }
}

export default authMiddleware ;