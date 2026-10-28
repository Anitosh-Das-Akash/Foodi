const mongoose=require("mongoose");

const partnerSchema=new mongoose.Schema({
    restaurentName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const partnerModel= mongoose.model("partner",partnerSchema);

module.exports=partnerModel;