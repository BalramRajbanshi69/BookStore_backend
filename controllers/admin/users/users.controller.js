const User = require("../../../models/auth/user.model");


exports.getUsers = async(req,res)=>{
    // const users = await User.find().select("-userPassword").select("-role"); this is the way to whom common users cannot see the admin role, password
    // const users = await User.find().select(["+userPassword","+isOtpVerified","-__v"]); //taking multiple arguments

    const userId = req.user.id;              // since req.user takes an object id is from isAuthenticated who is admin
    const users = await User.find({_id: {$ne : userId}}).select(["-__v"]);          // this means give all those users except the loggedin admin user $ne means not equal
    if(users.length > 1){
        res.status(200).json({
            message:"Users fetched successfully",
            data:users
        })
    }else{
        res.status(404).json({
            message:"Users collection is empty!",
            data:[]
        })
    }
}




// Admiin delete User api
exports.deleteUser = async(req,res)=>{
    const userId = req.params.id;
    if(!userId){
        return res.status(400).json({
            message:"Provide userId"
        })
    }

    // first way indicates that first find the user and then delete 
    const user = await User.findById(userId);
    if(!user){
        res.status(404).json({
            message:"User with that id not found"
        })
    }else{
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            message:"User deleted successfully"
        })
    }

    //  direct way
    // const userDelete = await User.findByIdAndDelete(userId);            
    // res.status(200).json({
    //     message:"User deleted successfully",
    //     data:userDelete
    // })
}