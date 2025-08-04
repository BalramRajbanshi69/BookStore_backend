const Book = require("../../models/book/book.model");
const BACKEND_URL = process.env.BACKEND_URL
const fs = require("fs")
const path = require("path");

// create book(admin)
exports.createBook = async (req, res) => {
        // const file = req.file;
        // let filePath;
        // if (!file) {
        //     filePath = "https://www.bing.com/images/search?q=books+image&id=0D7B8D91EEB148C7EEC09E98BE10785ACACA3785&FORM=IACFIR";
        // } else {
        //     filePath = BACKEND_URL + req.file.filename;
        // }


        const userId = req.user?.id
        let imageURL;
        if (!req.file) {
            imageURL = "https://www.bing.com/images/search?q=books+image&id=0D7B8D91EEB148C7EEC09E98BE10785ACACA3785&FORM=IACFIR";
        } else {
            imageURL = req.file.path;
        }

        const { title, author, description, publication, price, stockQuantity, bookStatus } = req.body;
        

        if (!title || !author || !description || !publication || !price || !stockQuantity || !bookStatus) {
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

exports.editBook = async(req,res)=>{
   
     const {id} = req.params 
      const {title,description,author,publication,price,stockQuantity,bookStatus} = req.body
      if(!title || !description || !author || !publication || !price || !stockQuantity || !bookStatus || !id){
        return res.status(400).json({
            message : "Please provide title,description,author,publication,price,stockQuantity,bookStatus,id"
        })
    }
    const oldData = await Book.findById(id)
    if(!oldData){
        return res.status(404).json({
            message : "No book data found with that id"
        })
    }
    
    
    const oldBookImage = oldData.bookImage // http://localhost:5000/1698943267271-bunImage.png"
    const lengthToCut  = BACKEND_URL.length
    const finalFilePathAfterCut = oldBookImage.slice(lengthToCut) // 1698943267271-bunImage.png
    if(req.file && req.file.filename){
        // REMOVE FILE FROM UPLOADS FOLDER
            fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
                if(err){
                    console.log("error deleting file",err) 
                }else{
                    console.log("file deleted successfully")
                }
            })
    }
   const datas =  await Book.findByIdAndUpdate(id,{
        title ,
        description ,
        author,
        publication,
        price,
        stockQuantity,
        bookStatus,
        bookImage : req.file && req.file.filename ? BACKEND_URL +  req.file.filename :  oldBookImage
    },{
        new : true,
    
    })
    res.status(200).json({
        messagee : "Book updated successfully",
        data : datas
    })
   
}




// deleteBook (admin)
exports.deleteBook = async(req,res)=>{
  const bookId = req.params.id;
  if(!bookId){
    return res.status(400).json({
      message:"Please provide id"
    })
  }

  const oldData = await Book.findById(bookId)
    if(!oldData){
        return res.status(404).json({
            message : "No book data found with that id"
        })
    }
    const oldBookImage = oldData.bookImage // http://localhost:5000/1698943267271-bunImage.png"
    const lengthToCut  = BACKEND_URL.length
    const finalFilePathAfterCut = oldBookImage.slice(lengthToCut) // 1698943267271-bunImage.png
    // REMOVE FILE FROM UPLOADS FOLDER
            fs.unlink("./uploads/" +  finalFilePathAfterCut,(err)=>{
                if(err){
                    console.log("error deleting file",err) 
                }else{
                    console.log("file deleted successfully")
                }
            })

   await Book.findByIdAndDelete(bookId);
  res.status(200).json({
    message:"Book deleted successfully"
  })
}
