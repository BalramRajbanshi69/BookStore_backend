const User = require("../../models/auth/user.model");
const bcrypt = require("bcryptjs")
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")

exports.regiterUser = async(req,res)=>{
    try {
        const {username,email,password,phone} = req.body;
        if(!username || !email || !password || !phone){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                message:"User already exist"
            })
        }

        //hashedpassword
        const hashedpassword = await bcrypt.hash(password,10)
        const userFound = await User.create({
            username,
            email,
            password:hashedpassword,
            phone
        })
        await userFound.save();
        res.status(200).json({
            message:"User registered successfully",
            data:userFound
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Internal server error!"
        })
        
    }
}


// login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(404).json({
        message: "User with that email not found",
      });
    }

    const isValidPassword = await bcrypt.compare(password, userFound.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: userFound._id }, JWT_SECRET,{expiresIn:"1hr"});
    res.status(200).json({
      message: "User logged in successfully",
      data: userFound,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



