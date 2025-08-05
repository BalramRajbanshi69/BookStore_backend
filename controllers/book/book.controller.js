const Book = require("../../models/book/book.model");
const BACKEND_URL = process.env.BACKEND_URL
const fs = require("fs")
const path = require("path")
const cloudinary = require("cloudinary").v2;

// create book(admin)
exports.createBook = async (req, res) => {
        // const file = req.file;
        // let filePath;
        // if (!file) {
        //     filePath = "https://www.bing.com/images/search?q=books+image&id=0D7B8D91EEB148C7EEC09E98BE10785ACACA3785&FORM=IACFIR";
        // } else {
        //     filePath = BACKEND_URL + req.file.filename;
        // }


     const userId = req.user?.id;
     let imageURL;
    
    if (!req.file) {
        imageURL = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
    } else {
 
        imageURL = req.file?.path;
    }
    
        const { title, author, description, publication, price, stockQuantity, bookStatus} = req.body;
        

        if (!title || !author || !description || !publication || !price || !stockQuantity || !bookStatus ) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        const book = await Book.create({
            title,
            author,
            description,
            publication,
            price,
            stockQuantity,
            bookStatus,
            bookImage: [imageURL],
            userId
        });
        
        
        res.status(200).json({
            message: "Book created successfully",
            data: book
        });
};



// get all books (admin + customer all no authentication authorization)

exports.getAllBooks = async(req,res)=>{
    
        const allBooks = await Book.find();                        
        if(allBooks.length ===0){
        res.status(404).json({
         message: "No books found",
         data: []
       });
        }else{
        res.status(200).json({
            message:"All books fetched successfully",
            data:allBooks
        })
    }
}


// same for admin + customer
// getBooksByID
exports.singleBook = async(req,res)=>{
    
        const bookId = req.params.id;
        const singleBook = await Book.find({_id:bookId});
         if (singleBook.length === 0) {
             res.status(400).json({
                message: "Book not found with that Id. The provided ID does not match any book."
            });
        }else{
            res.status(200).json({
                message:"Single book fetched successfully",
                data:singleBook
            })

        }
        
}


// edit book (admin)
// exports.editBook = async(req,res)=>{
   
//      const {id} = req.params 
//       const {title,description,author,publication,price,stockQuantity,bookStatus} = req.body
//       if(!title || !description || !author || !publication || !price || !stockQuantity || !bookStatus || !id){
//         return res.status(400).json({
//             message : "Please provide title,description,author,publication,price,stockQuantity,bookStatus,id"
//         })
//     }
//     const oldData = await Book.findById(id)
//     if(!oldData){
//         return res.status(404).json({
//             message : "No book data found with that id"
//         })
//     }
    
    
//     const oldBookImage = oldData.bookImage // http://localhost:5000/1698943267271-bunImage.png"
//     const lengthToCut  = BACKEND_URL.length
//     const finalFilePathAfterCut = oldBookImage.slice(lengthToCut) // 1698943267271-bunImage.png
//     if(req.file && req.file.filename){
//         // REMOVE FILE FROM UPLOADS FOLDER
//             fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
//                 if(err){
//                     console.log("error deleting file",err) 
//                 }else{
//                     console.log("file deleted successfully")
//                 }
//             })
//     }
//    const datas =  await Book.findByIdAndUpdate(id,{
//         title ,
//         description ,
//         author,
//         publication,
//         price,
//         stockQuantity,
//         bookStatus,
//         bookImage : req.file && req.file.filename ? BACKEND_URL +  req.file.filename :  oldBookImage
//     },{
//         new : true,
    
//     })
//     res.status(200).json({
//         messagee : "Book updated successfully",
//         data : datas
//     })
   
// }

exports.editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, publication, price, stockQuantity, bookStatus} = req.body;

   
     if (!title || !author || !description || !publication || !price || !stockQuantity || !bookStatus || !id ) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

    const oldData = await Book.findById(id);
    if (!oldData) {
      return res.status(404).json({
        message: "No data found with that id"
      });
    }

    // Security check: Only the book creator can edit it.
    if (oldData.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized to edit this book" });
    }

    const oldBookImageURL = oldData.bookImage[0];
    let newImageURL = oldBookImageURL;

    if (req.file) { // A new file was uploaded to Cloudinary
      // Extract the public_id from the old image URL
      const parts = oldBookImageURL.split('/');
      const filenameWithExtension = parts[parts.length - 1]; // e.g., 'book-123456789.jpg'
      const oldPublicId = parts[parts.length - 2] + '/' + filenameWithExtension.split('.')[0]; // e.g., 'e-commerce-books/book-123456789'
      
      // Delete the old file from Cloudinary, but only if it's not the default image
      if (!oldBookImageURL.startsWith("https://plus.unsplash.com")) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log("Old image deleted from Cloudinary successfully");
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      
      // Set the new image URL from the uploaded file
      newImageURL = req.file?.path;
    }

    const datas = await Book.findByIdAndUpdate(id, {
     title, 
     author,
      description,
      publication,
      price,
      stockQuantity,
      bookStatus,
      bookImage: [newImageURL]
    }, {
      new: true,
    });

    res.status(200).json({
      message: "Book updated successfully",
      data: datas
    });
  } catch (error) {
    console.error("Edit book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// deleteBook (admin)
// exports.deleteBook = async(req,res)=>{
//   const bookId = req.params.id;
//   if(!bookId){
//     return res.status(400).json({
//       message:"Please provide id"
//     })
//   }

//   const oldData = await Book.findById(bookId)
//     if(!oldData){
//         return res.status(404).json({
//             message : "No book data found with that id"
//         })
//     }
//     const oldBookImage = oldData.bookImage // http://localhost:5000/1698943267271-bunImage.png"
//     const lengthToCut  = BACKEND_URL.length
//     const finalFilePathAfterCut = oldBookImage.slice(lengthToCut) // 1698943267271-bunImage.png
//     // REMOVE FILE FROM UPLOADS FOLDER
//             fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
//                 if(err){
//                     console.log("error deleting file",err) 
//                 }else{
//                     console.log("file deleted successfully")
//                 }
//             })

//    await Book.findByIdAndDelete(bookId);
//   res.status(200).json({
//     message:"Book deleted successfully"
//   })
// }

exports.deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Please provide book ID" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }

    // Extract the image URL and public_id from the book data
    const oldbookImageURL = book.bookImage[0];

    // Delete the image from Cloudinary, but only if it's not the default image
    if (oldbookImageURL && !oldbookImageURL.startsWith("https://plus.unsplash.com")) {
      const parts = oldbookImageURL.split('/');
      const filenameWithExtension = parts[parts.length - 1];
      const oldPublicId = parts[parts.length - 2] + '/' + filenameWithExtension.split('.')[0];
      
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log(`Successfully deleted image from Cloudinary with public_id: ${oldPublicId}`);
      } catch (err) {
        console.error(`Error deleting image from Cloudinary with public_id: ${oldPublicId}:`, err);
      }
    }

    // Delete the book from the database
    await Book.findByIdAndDelete(id);

    // Remove the book from all user carts
    await User.updateMany(
      {},
      { $pull: { cart: { book: id } } }
    );

    // Remove the book from all existing orders
    await Order.updateMany(
      { 'items.book': id },
      { $pull: { items: { book: id } } }
    );

    res.status(200).json({
      success: true,
      message: "book and associated image deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};