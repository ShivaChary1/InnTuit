const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const { newRoute, indexRoute, showRoute, createRoute, editRoute, updateRoute, delRoute } = require("../controllers/listings.js");

router
.route("/")
.get( wrapAsync(indexRoute)) //Index
.post(isLoggedin, validateListing, wrapAsync(createRoute)) //create

//New route
router.get("/new",isLoggedin,newRoute)

//edit 
router.get("/:id/edit",isLoggedin,isOwner, wrapAsync(editRoute))
router
.route("/:id")
.get(wrapAsync(showRoute))//showroute
.put(isLoggedin,isOwner, validateListing, wrapAsync(updateRoute))//update route
.delete(isLoggedin,isOwner,wrapAsync(delRoute))//delroute


module.exports = router