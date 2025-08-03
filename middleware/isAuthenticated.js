const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
const {promisify} = require("util");
const User = require("../models/auth/user.model");
const isAuthenticated = async(req,res,next)=>{

    const token = req.headers.authorization?.split(' ')[1]; 
       if (!token) {
           return res.status(403).json({ message: "Please login" });
       }

    // alternative waY second
   try {
     const decoded = await promisify(jwt.verify)(token,JWT_SECRET);
    //  console.log("decoded",decoded);
     
    const doesUserExist = await User.findOne({_id:decoded.id});    
    if(!doesUserExist){
       return res.status(403).json({
            message:"User doesnot exist with that token/id"
        })
    } 
    req.user = doesUserExist    
    next()
   } catch (error) {
    res.status(400).json({
        message:error.message
    })
   }   
}

module.exports = isAuthenticated