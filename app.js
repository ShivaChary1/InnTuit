const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const path = require("path");
const ExpressError = require("./utils/ExpressError.js")
const ejsMate = require("ejs-mate");
const session = require("express-session")
const flash  = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")


const listingRouter = require("./routes/lisiting.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")



const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
let main = async ()=>{
    await mongoose.connect(mongoUrl)
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnlu : true
    }
}
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate)

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err)
})





app.get("/",(req,res)=>{
    res.send("Hi how are you");
})


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})


app.use((err,req,res,next)=>{
    let {status=500} = err 
    res.status(status).render("layouts/error.ejs",{err})
})


app.listen(8080,()=>{
    console.log(`listening on port 8080`);
})
