const jwt = require("jsonwebtoken");
const foodModel=require("../models/food.model")
const userModel=require("../models/users.model")
const foodPartnerModel=require("../models/foodpartner.model")

async function foodAuth(req,res,next) {

    const tokens=req.cookies.tokens;

    if(!tokens){
        return res.status(400).json({
            message:"Unauthorized access"
        })
    }

    try{

        const decoded=await jwt.verify(tokens,process.env.JWT_SECRET)
        
        const foodPartner=await foodPartnerModel.findById(decoded.id);

        if(!foodPartner){
            return res.status(401).json({
                message:"Food partner account not found"
            })
        }

        req.foodPartner=foodPartner;

        next()


    }catch(err){

        return res.status(400).json({
            message:"Invalid tokens",
            error:err.message
        })

    }
    
}

async function userAuth(req,res,next){
    const tokens=req.cookies.tokens;
    if(!tokens){
        return res.status(400).json({
            message:"Unauthorized Login"
        })
    }

    try{

        const decoded=jwt.verify(tokens,process.env.JWT_SECRET)
        const user= await userModel.findById(decoded.id)
        if(!user){
            return res.status(401).json({
                message:"User account not found"
            })
        }
        if(!user){
            return res.status(401).json({
                message:"User account not found"
            })
        }
        req.user= user
        next()

    }catch(err){
        console.log(err);
        
        return res.status(400).json({

            message:"Invalid Tokens"
            
        })
    }
}

async function optionalUserAuth(req,res,next){
    const tokens=req.cookies?.tokens;
    if(!tokens){
        return next()
    }

    try{
        const decoded=jwt.verify(tokens,process.env.JWT_SECRET)
        req.user=await userModel.findById(decoded.id) || undefined
        next()
    }catch(err){
        if(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"){
            console.warn("Optional user authentication failed:",err.message)
            return next()
        }

        next(err)
    }
}

module.exports={foodAuth,userAuth,optionalUserAuth}