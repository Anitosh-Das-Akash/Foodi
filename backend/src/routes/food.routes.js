
const express = require("express");
const multer = require("multer");
const authMiddleWare = require("../middlewares/auth.middleware");
const foodController = require("../controllers/food.controller");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024,
        files: 1
    }
});

router.post(
    "/food-item",
    authMiddleWare.foodAuth,
    (req, res, next) => {
        upload.single("video")(req, res, (err) => {
            if (err) {
                console.error("Multer error:", err.message);

                if (err instanceof multer.MulterError) {
                    return res.status(400).json({
                        message: err.message
                    });
                }

                return res.status(400).json({
                    message: "File upload rejected"
                });
            }

            next();
        });
    },
    foodController.addFoodItem
);

router.get("/",
    authMiddleWare.optionalUserAuth,
    foodController.getFoodItems
)

router.post(
    "/:foodId/love",
    authMiddleWare.userAuth,
    foodController.loveFoodItem
)

router.delete(
    "/:foodId/love",
    authMiddleWare.userAuth,
    foodController.loveFoodItem
)

router.post(
    "/:foodId/save",
    authMiddleWare.userAuth,
    foodController.saveFoodItem
)

router.delete(
    "/:foodId/save",
    authMiddleWare.userAuth,
    foodController.saveFoodItem
)

router.get(
    "/saved",
    authMiddleWare.userAuth,
    foodController.getSavedFoodItems
)

router.get(
    "/:foodId/comments",
    foodController.getFoodItemComments
)

router.post(
    "/:foodId/comments",
    authMiddleWare.userAuth,
    foodController.addFoodItemComment
)

router.post(
    "/:foodId/comments/:commentId/reply",
    authMiddleWare.foodAuth,
    foodController.replyToFoodItemComment
)

router.get(
    "/partners/:partnerId",
    authMiddleWare.optionalUserAuth,
    foodController.getFoodPartnerProfile
)

module.exports = router;
