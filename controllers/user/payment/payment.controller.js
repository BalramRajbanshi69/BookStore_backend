const User = require("../../../models/auth/user.model");
const Order = require("../../../models/user/order/order.model");
const { default: axios } = require("axios");


exports.initializeKhaltiPayment = async(req,res)=>{
    const {orderId,amount}= req.body;             // orderId is the unique ID for the order, amount is the total amount to be paid in paisa
    // console.log(orderId,amount);
    
    if(!orderId || !amount) {
        return res.status(400).json({message: "Order ID and amount are required"});
    }

    let order = await Order.findById(orderId); // find the order by ID
    if(!order){
        res.status(400).json({
            message:"No order with that id"
        })
    }

    // check coming amount is totalAmount of order
    if(order.totalAmount !== amount){
        return res.status(400).json({
            message:"Amount must be equal to totalAmount"
        })
    }

    const data ={
        return_url : "http://localhost:5173/success",  // /api/payment is from app.js api        // return URL where the user will be redirected after payment
        amount:amount * 100,                          // amount in rupees
        purchase_order_id: orderId, 
        purchase_order_name: "orderName_" + orderId,           // purchase order name, you can use any name you want
        website_url : "http://localhost:3500",      // website URL where the user will be redirected after payment

    }

   const response= await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/",data,{
        headers:{
            "Authorization": "key 0deafccdf04347dd81eb9d80c5611a05",
            "Content-Type": "application/json"
        }
    })
    // console.log(response.data);
    
    order.paymentDetails.pidx = response.data.pidx; // store the pidx in the order
    await order.save(); // save the order with the pidx
    res.status(200).json({
        message:"Payment successfully",
        paymentUrl : response.data.payment_url            // so that after successful payment, navigate to payment_url khalti page . see response.data in console
    })
    
    
}


// verfify payment/ payment verification
exports.verifyPidx = async(req,res)=>{
    const userId = req.user.id;
    const pidx = req.body.pidx; // pidx is the payment ID returned by Khalti after payment
    // directly
    const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/",{pidx},{
        headers:{
           "Authorization": "key 0deafccdf04347dd81eb9d80c5611a05",
            "Content-Type": "application/json" 
        }
    })

    if(response.data.status === "Completed"){
        // database modification
        let order = await Order.find({ "paymentDetails.pidx": pidx }); // find the order by pidx
        order[0].paymentDetails.method = "khalti"; // set the payment method to khalti
        order[0].paymentDetails.status = "paid"; // set the payment status to paid
        await order[0].save(); // save the order with the updated payment details

        // empty user cart after successfully payment
        const user = await User.findById(userId);
        user.cart = []
        await user.save();

       return res.status(200).json({
            message:"Payment verified successfully"
        })
    }
    
}