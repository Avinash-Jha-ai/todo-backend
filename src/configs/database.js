const mongoose =require("mongoose");

async function connectToDb(){
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("connected to mongoDb");
    })
}

module.exports =connectToDb