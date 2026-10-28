
const foodModel = require("../models/food.model");
const foodPartnerModel = require("../models/foodpartner.model");
const mongoose = require("mongoose");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function addFoodItem(req, res) {
    try {
        

        if (!req.file) {
            return res.status(400).json({
                message: "Video file is required"
            });
        }

        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        const result = await storageService.uploadFile(
            req.file.buffer,
            `${uuid()}.mp4`
        );

        

        console.log("Authenticated partner:", req.foodPartner?._id);
        const food = await foodModel.create({

            title,
            description,
            url: result.url,
            foodpartner: req.foodPartner._id
        });
        console.log("Saved food document:", food);

        return res.status(201).json({
            message: "Food item created successfully",
            food
        });

    } catch (error) {
        console.error("Food creation error:", error);

        return res.status(500).json({
            message: "Failed to create food item",
            error: error.message
        });
    }
}

async function getFoodItems(req,res) {

    try{

    const storedFoodItems=await foodModel.find({}).populate("foodpartner", "username restaurentName")
    const foodItems=storedFoodItems.map((foodItem) => {
        const { lovedBy, savedBy, comments, ...item } = foodItem.toObject();
        return {
            ...item,
            foodpartnerId: item.foodpartner?._id?.toString() || null,
            loveCount: lovedBy.length,
            commentCount: comments.length,
            isLoved: Boolean(req.user && lovedBy.some((userId) => userId.equals(req.user._id))),
            isSaved: Boolean(req.user && savedBy.some((userId) => userId.equals(req.user._id)))
        };
    });
    return res.status(200).json({
        message:"Foods items fetched Successfully",
        foodItems

    })
}catch (error) {
        console.error("Fetch food items error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch food items",
        });
    }
}

async function loveFoodItem(req, res) {
    const { foodId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
        return res.status(400).json({
            message: "Invalid food item ID"
        });
    }

    try {
        const foodItem = await foodModel.findById(foodId).select("lovedBy");

        if (!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        const isLoved = req.method === "POST";
        const update = isLoved
            ? { $addToSet: { lovedBy: req.user._id } }
            : { $pull: { lovedBy: req.user._id } };

        const updatedFoodItem = await foodModel.findByIdAndUpdate(foodId, update, {
            new: true,
            runValidators: true
        }).select("lovedBy");

        return res.status(200).json({
            isLoved,
            loveCount: updatedFoodItem.lovedBy.length
        });
    } catch (error) {
        console.error("Update food love error:", error);

        return res.status(500).json({
            message: "Failed to update video love"
        });
    }
}

async function saveFoodItem(req, res) {
    const { foodId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
        return res.status(400).json({
            message: "Invalid food item ID"
        });
    }

    try {
        const foodItem = await foodModel.findById(foodId).select("savedBy");

        if (!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        const isSaved = req.method === "POST";
        const update = isSaved
            ? { $addToSet: { savedBy: req.user._id } }
            : { $pull: { savedBy: req.user._id } };

        await foodModel.findByIdAndUpdate(foodId, update, {
            runValidators: true
        });

        return res.status(200).json({ isSaved });
    } catch (error) {
        console.error("Update saved food item error:", error);

        return res.status(500).json({
            message: "Failed to update saved food item"
        });
    }
}

async function getSavedFoodItems(req, res) {
    try {
        const storedFoodItems = await foodModel
            .find({ savedBy: req.user._id })
            .populate("foodpartner", "username restaurentName");
        const foodItems = storedFoodItems.map((foodItem) => {
            const { lovedBy, savedBy, ...item } = foodItem.toObject();
            return {
                ...item,
                foodpartnerId: item.foodpartner?._id?.toString() || null,
                loveCount: lovedBy.length,
                isLoved: lovedBy.some((userId) => userId.equals(req.user._id)),
                isSaved: savedBy.some((userId) => userId.equals(req.user._id))
            };
        });

        return res.status(200).json({ foodItems });
    } catch (error) {
        console.error("Fetch saved food items error:", error);

        return res.status(500).json({
            message: "Failed to fetch saved food items"
        });
    }
}

function validateCommentText(text) {
    return typeof text === "string" && text.trim().length > 0 && text.trim().length <= 1000;
}

function serializeComment(comment) {
    return {
        id: comment._id.toString(),
        username: comment.username,
        text: comment.text,
        createdAt: comment.createdAt,
        reply: comment.reply?.text ? {
            username: comment.reply.username,
            text: comment.reply.text,
            createdAt: comment.reply.createdAt
        } : null
    };
}

async function getFoodItemComments(req, res) {
    const { foodId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
        return res.status(400).json({ message: "Invalid food item ID" });
    }

    try {
        const foodItem = await foodModel.findById(foodId).select("comments");
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        return res.status(200).json({
            comments: foodItem.comments.map(serializeComment)
        });
    } catch (error) {
        console.error("Fetch food comments error:", error);
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
}

async function addFoodItemComment(req, res) {
    const { foodId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
        return res.status(400).json({ message: "Invalid food item ID" });
    }
    if (!validateCommentText(text)) {
        return res.status(400).json({
            message: "Comment must contain 1 to 1000 characters"
        });
    }

    try {
        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        foodItem.comments.push({
            user: req.user._id,
            username: req.user.username,
            text: text.trim()
        });
        await foodItem.save();
        const comment = foodItem.comments[foodItem.comments.length - 1];

        return res.status(201).json({
            comment: serializeComment(comment),
            commentCount: foodItem.comments.length
        });
    } catch (error) {
        console.error("Create food comment error:", error);
        return res.status(500).json({ message: "Failed to add comment" });
    }
}

async function replyToFoodItemComment(req, res) {
    const { foodId, commentId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(foodId) || !mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: "Invalid food item or comment ID" });
    }
    if (!validateCommentText(text)) {
        return res.status(400).json({
            message: "Reply must contain 1 to 1000 characters"
        });
    }

    try {
        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
        if (!foodItem.foodpartner.equals(req.foodPartner._id)) {
            return res.status(403).json({
                message: "Only this food partner can reply to its post"
            });
        }

        const comment = foodItem.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.reply = {
            foodpartner: req.foodPartner._id,
            username: req.foodPartner.username,
            text: text.trim(),
            createdAt: new Date()
        };
        await foodItem.save();

        return res.status(200).json({
            comment: serializeComment(comment)
        });
    } catch (error) {
        console.error("Reply to food comment error:", error);
        return res.status(500).json({ message: "Failed to reply to comment" });
    }
}

async function getFoodPartnerProfile(req, res) {
    const { partnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
        return res.status(400).json({
            message: "Invalid food partner ID"
        });
    }

    try {
        const foodPartner = await foodPartnerModel
            .findById(partnerId)
            .select("username restaurentName");

        if (!foodPartner) {
            return res.status(404).json({
                message: "Food partner not found"
            });
        }

        const storedFoodItems = await foodModel.find({ foodpartner: foodPartner._id });
        const foodItems = storedFoodItems.map((foodItem) => {
            const { lovedBy, savedBy, ...item } = foodItem.toObject();
            return {
                ...item,
                loveCount: lovedBy.length,
                isLoved: Boolean(req.user && lovedBy.some((userId) => userId.equals(req.user._id))),
                isSaved: Boolean(req.user && savedBy.some((userId) => userId.equals(req.user._id)))
            };
        });

        return res.status(200).json({
            foodPartner,
            foodItems
        });
    } catch (error) {
        console.error("Fetch food partner profile error:", error);

        return res.status(500).json({
            message: "Failed to fetch food partner profile"
        });
    }
}


module.exports = {
    addFoodItem,
    getFoodItems,
    loveFoodItem,
    saveFoodItem,
    getSavedFoodItems,
    getFoodItemComments,
    addFoodItemComment,
    replyToFoodItemComment,
    getFoodPartnerProfile
};
