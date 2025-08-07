// book.routes.js

const express = require("express");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const catchAsync = require("../../services/catchAsync");
const {createBook,getAllBooks,singleBook, editBook, deleteBook, updateBookStatus, updateBookStockAndPrice, getOrdersOfBook, } = require("../../controllers/book/book.controller")
const router = express.Router();

// const { multer, storage } = require("../../middleware/multer");
// const upload = multer({ storage: storage });

const upload = require("../../middleware/multer")

router.route("/")
    .post(isAuthenticated, permitTo("ADMIN"), upload.single("bookImage"), catchAsync(createBook)) 
    .get(catchAsync(getAllBooks)); 

router.route("/:id")
    .get(catchAsync(singleBook)) 
    .patch(isAuthenticated, permitTo("ADMIN"), upload.single("bookImage"), catchAsync(editBook))
    .delete(isAuthenticated,permitTo("ADMIN"),catchAsync(deleteBook)) 


    
router.route("/status/:id")
    .patch(isAuthenticated,permitTo("ADMIN"),catchAsync(updateBookStatus))
    
router.route("/stockandprice/:id")
    .patch(isAuthenticated,permitTo("ADMIN"),catchAsync(updateBookStockAndPrice))
    
    
    //  getting how much orders a product made
router.route("/bookOrders/:id").get(isAuthenticated,permitTo("ADMIN"), catchAsync(getOrdersOfBook))


module.exports = router;