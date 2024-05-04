const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const { saveRedirected } = require("../middleware.js")
const { getSignup, postSignup, getLogin, postLogin, Dologout } = require("../controllers/users.js")

router
.route("/signup")
.get(getSignup)
.post(wrapAsync(postSignup))

router
.route("/login")
.get(getLogin)
.post(saveRedirected,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(postLogin))

router.get("/logout",Dologout)


module.exports = router