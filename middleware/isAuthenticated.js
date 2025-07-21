const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
const {promisify} = require("util");
const User = require("../models/auth/user.model");
const isAuthenticated = async(req,res,next)=>{
    const token = req.headers.token;
    if(!token){
    return res.status(403).json({
            message:"Please login"
        })
    }
    // verify if token is legit or not
    // first way
  //   try {
  //   const data = await jwt.verify(token, JWT_SECRET);
  //   req.user = data.user
  //   next();
  // } catch (err) {
  //   return res.status(401).json({
  //     message: "Invalid token"
  //   });
  // }



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


// third alternative
//  try {
//     const data = await jwt.verify(token, JWT_SECRET);
//     req.user = data.user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       msg: "Invalid Token",
//     });
//   }



   
}

module.exports = isAuthenticated