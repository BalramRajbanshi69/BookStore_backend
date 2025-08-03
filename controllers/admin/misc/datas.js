const User = require("../../../models/auth/user.model")
const Book = require("../../../models/book/book.model")
const Order = require("../../../models/user/order/order.model")


exports.getAllDatas = async(req,res)=>{                         // to show in dashboard
    const users = (await User.find()).length
    const orders = (await Order.find()).length
    const books = (await Book.find()).length

    
    const allOrders = await Order.find().populate({           
        path: "items.book",  // populate the book field in items
        model: "Book"         // specify the model to populate from
    }).populate("user")
    

    res.status(200).json({
        message:"Datas fetched successfully",
        data:{
            orders,
            users,
            books,
            allOrders
        }
    })
}