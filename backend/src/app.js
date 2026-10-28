require("dotenv").config()
const express=require("express")
const authroutes=require("./routes/auth.routes")
const foodroutes=require("./routes/food.routes")
const cookieparser=require('cookie-parser')
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use('/api/auth',authroutes)
app.use('/api/food',foodroutes)


module.exports=app;