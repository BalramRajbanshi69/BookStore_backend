// performing restriction/permission to whom to perform task as role of admin or customer or super-admin
const permitTo = (...roles)=>{
    return (req,res,next)=>{
        const userRole = req.user.role;
        // console.log(userRole);
        // console.log(roles);
        // here the ...roles comes from permitTo("admin") in routes, which has admin permission and req.user.role has customer if logged in user is customer
        // and if roles.includes(userRole doesnot match admin !== customer , it shows error status(403) else if match roles("admin") == req.user.role then goes to next)
        if(!roles.includes(userRole)){
             res.status(403).json({
                message:"You don't have permisson to perform this.forbidden"
            })
        }else{
            next()
        }
            
    }
}

module.exports = permitTo