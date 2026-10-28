const express=require('express');
const authController=require('../controllers/auth.controller')
const authMiddleware=require('../middlewares/auth.middleware')

const router=express.Router()


/* users routes */

router.post("/users/register",authController.registerUser)
router.post("/users/login",authController.loginUser)
router.get("/users/me",authMiddleware.userAuth,authController.getUserSession)
router.get("/users/logout",authController.logoutUser)

/* food partner routes*/

router.post("/foodpartner/register",authController.registerFoodPartner)
router.post("/foodpartner/login",authController.loginFoodPartner)
router.get("/foodpartner/me",authMiddleware.foodAuth,authController.getFoodPartnerSession)
router.get("/foodpartner/logout",authController.logoutFoodPartner)

module.exports=router;