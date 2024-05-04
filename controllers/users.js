const User = require("../models/user.js")


module.exports.getSignup = (req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.postSignup = async (req,res)=>{
    try{
        let {username,password,email} = req.body
        const newUser = new User({email,username})
        let registeredUser = await User.register(newUser,password)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","New User Registered")
            res.redirect("/listings")
        })
    }catch(error){
        req.flash("error",error.message)
        res.redirect("/signup")
    }
    
}

module.exports.getLogin = (req,res)=>{
    res.render("user/login.ejs")
}

module.exports.postLogin = async(req,res)=>{
    req.flash("success","Welcome, You're logged in!!")
    if(res.locals.redirect){res.redirect(res.locals.redirectUrl)}
    else{res.redirect("/listings")}
    
}

module.exports.Dologout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You are logged out")
        res.redirect("/listings")
    })
}