
const userModel = require("../models/users.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cookie settings for local and production environments
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
};

// Generate JWT token
function generateToken(id) {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// Register User
async function registerUser(req, res) {
    const { username, email, password } = req.body;

    const userAlreadyExist = await userModel.findOne({ email });

    if (userAlreadyExist) {
        return res.status(409).json({
            message: "Email already registered"
        });
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: passwordHashed
    });

    const token = generateToken(user._id);

    res.cookie("tokens", token, cookieOptions);

    return res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email
    });
}

// Login User
async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordVerified = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordVerified) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const token = generateToken(user._id);

    res.cookie("tokens", token, cookieOptions);

    return res.status(200).json({
        message: "Login successfully"
    });
}

// Logout User
function logoutUser(req, res) {
    res.clearCookie("tokens", cookieOptions);

    return res.status(200).json({
        message: "Logout successfully"
    });
}

// Get User Session
function getUserSession(req, res) {
    return res.status(200).json({
        id: req.user._id.toString(),
        username: req.user.username,
        email: req.user.email
    });
}

// Register Food Partner
async function registerFoodPartner(req, res) {
    const { restaurentName, username, email, password } = req.body;

    const partnerExist = await foodPartnerModel.findOne({ email });

    if (partnerExist) {
        return res.status(409).json({
            message: "Email already registered"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = await foodPartnerModel.create({
        restaurentName,
        username,
        email,
        password: hashedPassword
    });

    const token = generateToken(partner._id);

    res.cookie("tokens", token, cookieOptions);

    return res.status(201).json({
        id: partner._id,
        restaurentName: partner.restaurentName,
        username: partner.username,
        email: partner.email
    });
}

// Login Food Partner
async function loginFoodPartner(req, res) {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        foodPartner.password
    );

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const token = generateToken(foodPartner._id);

    res.cookie("tokens", token, cookieOptions);

    return res.status(200).json({
        message: "Partner login successfully"
    });
}

// Logout Food Partner
function logoutFoodPartner(req, res) {
    res.clearCookie("tokens", cookieOptions);

    return res.status(200).json({
        message: "Logout successfully"
    });
}

// Get Food Partner Session
function getFoodPartnerSession(req, res) {
    return res.status(200).json({
        id: req.foodPartner._id.toString()
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserSession,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    getFoodPartnerSession
};
