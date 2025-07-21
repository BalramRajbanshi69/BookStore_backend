const mongoose = require("mongoose")
const {Schema} = mongoose
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        lowercase:true,
        min:[3,"username should have minlength of 3 chars"],
        max:[20,"username should not exceed 20 character"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
  password:{
    type:String,
    required:[true,"Password is required"],
    min:[8,"Password length must have minimum of 8 characters"],
    max:[128,"Password length must not exceed 128 chars"]
},
    phone:{
        type:String,
        required:[true,"Phone number is required"]
    },
    role:{
        type:String,
        enum:["CUSTOMER","ADMIN"],
        default:"CUSTOMER"
    },
    cart:[
        {
        quantity:{
            type:Number,
            required:true
        },
        book:{type:Schema.Types.ObjectId, ref:"Book"}
    }],

},{
    timestamps:true
})

const User = mongoose.model("User",userSchema)
module.exports = User