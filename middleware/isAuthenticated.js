// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET
// const {promisify} = require("util");
// const User = require("../models/auth/user.model");
// const isAuthenticated = async(req,res,next)=>{

//     const token = req.headers.authorization?.split(' ')[1]; 
//        if (!token) {
//            return res.status(403).json({ message: "Please login" });
//        }

//     // alternative waY second
//    try {
//      const decoded = await promisify(jwt.verify)(token,JWT_SECRET);
//     //  console.log("decoded",decoded);
     
//     const doesUserExist = await User.findOne({_id:decoded.id});    
//     if(!doesUserExist){
//        return res.status(403).json({
//             message:"User doesnot exist with that token/id"
//         })
//     } 
//     req.user = doesUserExist    
//     next()
//    } catch (error) {
//     res.status(400).json({
//         message:error.message
//     })
//    }   
// }

// module.exports = isAuthenticated






const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/auth/user.model");

const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Please provide a valid token" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const doesUserExist = await User.findOne({ _id: decoded.id });

        if (!doesUserExist) {
            return res.status(401).json({ message: "User  does not exist with that token/id" });
        }

        req.user = doesUserExist;
        next();
    } catch (error) {
        console.error("JWT Authentication Error:", error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = isAuthenticated;
