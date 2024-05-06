const Listing = require("../models/listing.js")
const mbxGeo = require('@mapbox/mapbox-sdk/services/geocoding')
const baseClient = mbxGeo({accessToken: "pk.eyJ1Ijoic2hpdmFjaGFyeTEiLCJhIjoiY2x2dW1qajgyMDVpNzJrcGp2c3oxN3I5dCJ9.CScHJRHGcDbrH6R7tTCdLQ" })



module.exports.indexRoute = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.newRoute = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showRoute = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate : {
            path: "author"
        }},
    ).populate("owner")
    if(!listing){
        req.flash("error","The Listing you are looking for, does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}

module.exports.createRoute = async (req,res)=>{
    let response = await baseClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.geometry = response.body.features[0].geometry

    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.editRoute = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","The Listing you are looking for, does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateRoute = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You not allowed to edit!")
        return res.redirect(`/listings/${id}`)
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing1})
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.delRoute = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}