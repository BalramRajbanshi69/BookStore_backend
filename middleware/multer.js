const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    //  check the mimetype of file to be uploaded
    const allowedFileTypes = ["image/jpg","image/png","image/jpeg"];
    if(!allowedFileTypes.includes(file.mimetype)){
        cb(new Error("This file cannot be supported"))  // cb means callback(err,success)
        return
    }
    
    cb(null, './uploads')  // ./uploads where you want to have your images files in root 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+"-"+ file.originalname)   // Date.now will show the date in millisecond to override multiple same file upload
  }
})

module.exports= {multer,storage}