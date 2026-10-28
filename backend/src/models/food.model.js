const mongoose=require("mongoose")

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reply: {
        foodpartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'partner'
        },
        username: String,
        text: {
            type: String,
            maxlength: 1000
        },
        createdAt: Date
    }
}, { _id: true })

const foodSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    foodpartner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'partner',
        required: true

    },
    lovedBy: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }],
        default: []
    },
    savedBy: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }],
        default: []
    },
    comments: {
        type: [commentSchema],
        default: []
    }
})

const foodModel=mongoose.model("food",foodSchema);

module.exports=foodModel;