// const User = require("../../../models/auth/user.model");
// const Order = require("../../../models/user/order/order.model");
// const { default: axios } = require("axios");


// exports.initializeKhaltiPayment = async(req,res)=>{
//     const {orderId,amount}= req.body;             // orderId is the unique ID for the order, amount is the total amount to be paid in paisa
//     // console.log(orderId,amount);
    
//     if(!orderId || !amount) {
//         return res.status(400).json({message: "Order ID and amount are required"});
//     }

//     let order = await Order.findById(orderId); // find the order by ID
//     if(!order){
//         res.status(400).json({
//             message:"No order with that id"
//         })
//     }

//     // check coming amount is totalAmount of order
//     if(order.totalAmount !== amount){
//         return res.status(400).json({
//             message:"Amount must be equal to totalAmount"
//         })
//     }

//     const data ={
//         return_url : "http://localhost:5173/success",  // /api/payment is from app.js api        // return URL where the user will be redirected after payment
//         amount:amount * 100,                          // amount in rupees
//         purchase_order_id: orderId, 
//         purchase_order_name: "orderName_" + orderId,           // purchase order name, you can use any name you want
//         website_url : "http://localhost:3500",      // website URL where the user will be redirected after payment

//     }

//    const response= await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/",data,{
//         headers:{
//             "Authorization": "key 0deafccdf04347dd81eb9d80c5611a05",
//             "Content-Type": "application/json"
//         }
//     })
//     // console.log(response.data);
    
//     order.paymentDetails.pidx = response.data.pidx; // store the pidx in the order
//     await order.save(); // save the order with the pidx
//     res.status(200).json({
//         message:"Payment successfully",
//         paymentUrl : response.data.payment_url            // so that after successful payment, navigate to payment_url khalti page . see response.data in console
//     })
    
    
// }


// // verfify payment/ payment verification
// exports.verifyPidx = async(req,res)=>{
//     const userId = req.user.id;
//     const pidx = req.body.pidx; // pidx is the payment ID returned by Khalti after payment
//     // directly
//     const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/",{pidx},{
//         headers:{
//            "Authorization": "key 0deafccdf04347dd81eb9d80c5611a05",
//             "Content-Type": "application/json" 
//         }
//     })

//     if(response.data.status === "Completed"){
//         // database modification
//         let order = await Order.find({ "paymentDetails.pidx": pidx }); // find the order by pidx
//         order[0].paymentDetails.method = "khalti"; // set the payment method to khalti
//         order[0].paymentDetails.status = "paid"; // set the payment status to paid
//         await order[0].save(); // save the order with the updated payment details

//         // empty user cart after successfully payment
//         const user = await User.findById(userId);
//         user.cart = []
//         await user.save();

//        return res.status(200).json({
//             message:"Payment verified successfully"
//         })
//     }
    
// }









const { default: axios } = require("axios");
const Order = require("../../../models/user/order/order.model");
const User = require("../../../models/auth/user.model");


exports.initializeKhaltiPayment = async (req, res) => {
    const { orderId, amount } = req.body;
    
    if (!orderId || !amount) {
        return res.status(400).json({ message: "Order ID and amount are required" });
    }

    let order = await Order.findById(orderId);
    if (!order) {
        return res.status(400).json({ message: "No order with that id" });
    }

    if (order.totalAmount !== amount) {
        return res.status(400).json({ message: "Amount must be equal to totalAmount" });
    }

    const data = {
        return_url: `${process.env.FRONTEND_URL}/success`,
        amount: amount * 100, // Convert to paisa
        purchase_order_id: orderId,
        purchase_order_name: "orderName_" + orderId,
        // Use an environment variable here for consistency
        website_url: process.env.FRONTEND_URL, 
    };

    try {
        const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", data, {
            headers: {
                // It is a security risk to hardcode your key here. Use an env variable.
                "Authorization": `key ${process.env.KHALTI_SECRET_KEY}`, 
                "Content-Type": "application/json"
            }
        });
        
        order.paymentDetails.pidx = response.data.pidx;
        await order.save();
        
        return res.status(200).json({
            message: "Payment successfully initialized",
            paymentUrl: response.data.payment_url
        });
    } catch (error) {
        // This catch block will prevent the server from crashing
        console.error("Khalti API Error:", error.response ? error.response.data : error.message);
        
        return res.status(500).json({
            message: "Failed to initialize payment with Khalti.",
            error: error.response ? error.response.data : "Unknown error"
        });
    }
};


// Payment verification
exports.verifyPidx = async (req, res) => {
    const userId = req.user.id;
    const pidx = req.body.pidx;

    try {
        const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/", { pidx }, {
            headers: {
                // Use an environment variable here as well
                "Authorization": `key ${process.env.KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (response.data.status === "Completed") {
            let order = await Order.findOne({ "paymentDetails.pidx": pidx });
            if (order) {
                order.paymentDetails.method = "khalti";
                order.paymentDetails.status = "paid";
                await order.save();
            }

            const user = await User.findById(userId);
            user.cart = [];
            await user.save();

            return res.status(200).json({
                message: "Payment verified successfully"
            });
        }
        
        // If status is not 'Completed', send a specific error message
        return res.status(400).json({ message: "Payment was not successful or is still pending." });

    } catch (error) {
        console.error("Khalti Verification Error:", error.response ? error.response.data : error.message);

        return res.status(500).json({
            message: "Failed to verify payment with Khalti.",
            error: error.response ? error.response.data : "Unknown error"
        });
    }
};