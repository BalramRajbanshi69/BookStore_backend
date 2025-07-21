const User = require("../../../models/auth/user.model");
const Book = require("../../../models/book/book.model");


exports.addToCart = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const bookId = req.params.bookId; // assuming book ID is sent in the request body , we can also use req.params.bookId
    if(!bookId){
        return res.status(400).json({message: "Book ID is required"});
    }

    const bookExist = await Book.findById(bookId);
    if(!bookExist){
        return res.status(404).json({message: "Book not found with that book ID"});
    }

    const user = await User.findById(userId);
    // check if that bookId exists or not , if exist increase quantity by 1 , if not bookId
    const existingCartItem = user.cart.find((item)=>item.book.equals(bookId));
    if(existingCartItem){
        existingCartItem.quantity+=1
    }else{
        user.cart.push({
            book:bookId,
            quantity:1
        });          // add book Id to user's cart // cart field made in userModel.js // Note: Ensure that the cart field in userModel.js is an array of ObjectIds
    }
    await user.save();
    const updatedUser = await User.findById(userId).populate("cart.book")
    res.status(200).json({
        message: "book added to cart successfully",
        data: updatedUser.cart
        }); 
    
}


// getMyCartItems
exports.getMyCartItems = async(req,res)=>{
    const userId = req.user.id; // assuming user ID is stored in req.user
    const userData = await User.findById(userId).populate({
        path: 'cart.book', // populate the cart field and inside book field backend userModel 
        select:"-bookStatus "       // exclude bookStatus from the populated data // to exclude multiple fields, useselect: "-field1 -field2"
        // select:"-bookStatus -bookName -__v -createdAt ..."       // to exclude multiple fields, useselect: "-field1 -field2"
    }); 
    
    if(!userData){
        return res.status(404).json({message: "User not found"});
    }

    res.status(200).json({
        message: "Cart items retrieved successfully",
        data: userData.cart
    });
}



// removeFromCart
exports.removeFromCart = async(req,res)=>{

    const userId = req.user.id;
    const bookId = req.params.bookId; // assuming book ID is sent in the request body , we can also use req.params.bookId
    

    // check if that book exists or not
    const bookExist = await Book.findById(bookId);
    if(!bookExist){
        return res.status(404).json({message: "book not found with that book ID"});
    }

    

    const user = await User.findById(userId);
    // use of filter method to remove the book from the cart
    // intially why we have used user.cart  because we are updating the cart field in userModel.js, which is an array of ObjectIds so we need to filter out the book ID from the cart array and then save the user
    // user.cart = user.cart.filter((pId)=>pId != bookId); // filter out the book ID from the cart array

    user.cart = user.cart.filter(item=>item.book != bookId);
    // or (same working)
    // user.cart = user.cart.filter(item => !item.book.equals(bookId));
    await user.save();
    res.status(200).json({
        message: "book removed from cart successfully",
        data: user.cart
    });
}




// updateCartItems
exports.updateCartItems = async(req,res)=>{
    const userId = req.user.id;
    const bookId = req.params.bookId;
    const {quantity} = req.body;

    const user = await User.findById(userId);
    const cartItem = user.cart.find((item)=>item.book.equals(bookId));
    if(!cartItem){
        return res.status(404).json({
            message:"No items with that id"
        })
    }
    cartItem.quantity = quantity
    await user.save();
    res.status(200).json({
        message:"cart items updated successfully",
        data:user.cart
    })
}