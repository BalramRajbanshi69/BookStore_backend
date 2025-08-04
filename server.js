require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 4000
const dbConnect = require("./db/db")
dbConnect()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:["https://book-store-system-virid.vercel.app","http://localhost:5174"],
    methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true
}))


// multer    
app.use(express.static("./uploads"))  

app.get("/",(req,res)=>{
    res.send("hello")
})


//routes
const authUser = require("./routes/auth/user.route")
const bookRoute = require("./routes/book/book.route")
const cartRoute = require("./routes/user/cart/cart.route")
const orderRoute = require("./routes/user/order/order.route")
const paymentRoute = require("./routes/user/payment/payment.route")
const profileRoute = require("./routes/user/profile/profile.route")
const getAllDatasRoute = require("./routes/admin/getAllDatas")


//apis
app.use("/api/auth",authUser)
app.use("/api/books",bookRoute)
app.use("/api/cart",cartRoute)
app.use("/api/order",orderRoute)
app.use("/api/payment",paymentRoute)
app.use("/api/profile",profileRoute)
app.use("/api/admin",getAllDatasRoute)



app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})