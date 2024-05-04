const Listing = require("./models/listing.js")
const listingSchema = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js")
const Review = require("./models/reviews.js")

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error","login to add a new listing!")
        res.redirect("/login")
    }
    next()
}


module.exports.saveRedirected = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(res.locals.currUser && ! res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("error","You are not allowed to do that!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body.listing);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400,error)
    }else{
        next()
    }
}

module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params
    let review = await Review.findById(reviewId)
    if(res.locals.currUser && ! res.locals.currUser._id.equals(review.author)){
        req.flash("error","You are not allowed to do that!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}