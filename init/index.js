const mongoose = require("mongoose")
const initData = require("./data")
const Listing = require("../models/listing")


const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
let main = async ()=>{
    await mongoose.connect(mongoUrl)
}
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err)
})


const initDB = async ()=>{
    await Listing.deleteMany({})
    initData.data = initData.data.map((ob)=>({...ob,owner:"6631daa7b9c727c3398c3989"}))
    await Listing.insertMany(initData.data)
    console.log("data is initted")
}
initDB();