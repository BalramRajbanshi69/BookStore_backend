const mongoose = require("mongoose");
const adminSeeder = require("../adminSeeder");
const mongoURL = process.env.mongoURL

const dbConnect = ()=>{
    mongoose.connect(mongoURL).then(()=>{
        console.log("MongoDB connected successfully");
        adminSeeder()
    }).catch(()=>{
        console.log("Error connecting MongoDB");
    })
}

module.exports = dbConnect