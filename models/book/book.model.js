const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required"]
    },
    author:{
        type:String,
        required:[true,"Author is required"]
    },
    description:{
        type:String,
        required:[true,"Description is required"]
    },
    publication:{
        type:String,
        required:[true,"Publication date is required"]
    },
    price:{
        type:Number,
        required:[true,"Book price is required"]
    },
    stockQuantity:{
        type:Number,
        required:[true,"Stock Quantity is required"]
    },
    bookStatus:{
        type:String,
        enum:["available","unavailable"]
    },
    bookImage:{
        type:[String],
        required:[true,"Image of book is required"],
    }
},{
    timestamps:true
})

const Book = mongoose.model("Book",bookSchema)
module.exports = Book