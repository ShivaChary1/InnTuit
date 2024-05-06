const mongoose = require("mongoose")
const Reviews = require("./reviews.js")
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title : String,
    description : String,
    image : {
        type:String,
        default :"https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : (v) => v==="" ? "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    price : Number,
    location: String,
    country : String,
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type:{
            type: String,
            enum : 'Point',
            required : true,
        },
        coordinates:{
            type: [Number],
            required : true
        }
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Reviews.deleteMany({_id :{$in: listing.reviews}})
}})

const ListingModel = mongoose.model("Listing",listingSchema)
module.exports = ListingModel