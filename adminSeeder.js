const bcrypt = require("bcryptjs");
const User = require("./models/auth/user.model");

const adminSeeder = async()=>{  
     const isAdminExist = await User.findOne({email:"admin@gmail.com"});
    
    if(!isAdminExist){
        await User.create({
        email:"admin@gmail.com",
        password: bcrypt.hashSync("admin",10),
        phone:"9887453444",
        username:"admin",
        role :"ADMIN"
        })
        console.log("Admin seeded successfully");
    }else{
        console.log("Admin already seeded");
        
    }
}

module.exports = adminSeeder