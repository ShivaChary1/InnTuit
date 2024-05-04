const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.postReviw = async (req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = Review(req.body.review)
    newReview.author = req.user._id 
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success","New Review posted!")
    res.redirect("/listings/"+listing.id)
}

module.exports.delReview = async(req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Deleted Review!")
    res.redirect("/listings/"+id)
}