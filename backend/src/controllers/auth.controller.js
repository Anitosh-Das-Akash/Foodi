const userModel=require("../models/users.model")
const foodpartnermodel=require("../models/foodpartner.model")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const partnerModel = require("../models/foodpartner.model");
const foodModel=require("../models/food.model")


/**users auth functions */

async function registerUser(req,res) {

    const{username,email,password}=req.body;

    const userAlreadyExist=await userModel.findOne({
        email
    })

    if(userAlreadyExist){
        return res.status(400).json({
            message:"UserName or Password Invalid"
        })
    }

    const passwordHashed=await bcrypt.hash(password,10);

    const user=await userModel.create({
        username,
        email,
        password: passwordHashed
    })

    const tokens=jwt.sign({
        id: user._id

    },process.env.JWT_SECRET)

    res.cookie("tokens",tokens);

    res.status(201).json({
        id:user._id,
        username:user.username,
        email:user.email

    })

    



    

}
async function loginUser(req,res) {

    const{email,password}=req.body;

    const user=await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message:"Invalid user"
        })
    }

    const isPasswordVarified= await bcrypt.compare(password,user.password);

    if(!isPasswordVarified){
        res.status(400).json({
            message:"Invalid Password"
        })
    }

    const tokens=jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

     res.cookie("tokens", tokens, {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });


    res.status(201).json({
        message:"Login Successfully"
    })



    
}

function logoutUser(req,res) {

    res.clearCookie("tokens")
    res.status(200).json({
        message:"Logout successfully"
    })
    
}

function getUserSession(req, res) {
    return res.status(200).json({
        id: req.user._id.toString(),
        username: req.user.username,
        email: req.user.email
    });
}

// food partner auth function

async function registerFoodPartner(req,res) {
    
    const {restaurentName,username,email,password}=req.body;

    const partnerExist=await foodpartnermodel.findOne({
        email
    })

    if(partnerExist){
        return res.status(400).json({
            meesgae:"User Already exists"
        })
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const partner=await partnerModel.create({

        restaurentName,
        username,
        email,
        password: hashedPassword
    })

    const tokens= jwt.sign({
        id:partner._id
    },process.env.JWT_SECRET)

    res.cookie("tokens",tokens, {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });

    res.status(201).json({
        id: partner._id,
        restaurentName: partner.restaurentName,
       username: partner.username,
        email: partner.email
    })


    
}

async function loginFoodPartner(req,res) {
    
    const {email,password}= req.body;

    const foodPartner=await foodpartnermodel.findOne({
        email
    })

    if(!foodPartner){

        return res.status(400).json({
            message:"You have to register first"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,foodPartner.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }

    const tokens=jwt.sign({
        id: foodPartner._id
    },process.env.JWT_SECRET)

    res.cookie("tokens",tokens, {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });

    res.status(201).json({
        message:"Partner login successfully"
    })

    






}

function logoutFoodPartner(req,res){

    res.clearCookie("tokens")
    res.status(201).json({
        message:"Logout Successfully"
    })

}

function getFoodPartnerSession(req, res) {
    return res.status(200).json({
        id: req.foodPartner._id.toString()
    });
}

module.exports={registerUser,loginUser,logoutUser,getUserSession,registerFoodPartner,loginFoodPartner,logoutFoodPartner,getFoodPartnerSession}