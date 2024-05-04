const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const {validateReview, isLoggedin, isAuthor} = require("../middleware.js");
const { postReviw, delReview } = require("../controllers/reviews.js");


//post review
router.post("/",isLoggedin,
validateReview,wrapAsync(postReviw))
//delete review
router.delete("/:reviewId",isAuthor, wrapAsync(delReview))

module.exports = router