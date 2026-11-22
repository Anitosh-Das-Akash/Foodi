
const jwt = require("jsonwebtoken");
const userModel = require("../models/users.model");
const foodPartnerModel = require("../models/foodpartner.model");

async function foodAuth(req, res, next) {
    const token = req.cookies?.tokens;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!foodPartner) {
            return res.status(401).json({
                message: "Food partner account not found"
            });
        }

        req.foodPartner = foodPartner;
        next();

    } catch (err) {
        if (
            err.name === "JsonWebTokenError" ||
            err.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        next(err);
    }
}

async function userAuth(req, res, next) {
    const token = req.cookies?.tokens;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized login"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User account not found"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        if (
            err.name === "JsonWebTokenError" ||
            err.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        next(err);
    }
}

async function optionalUserAuth(req, res, next) {
    const token = req.cookies?.tokens;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await userModel.findById(decoded.id) || undefined;

        next();

    } catch (err) {
        if (
            err.name === "JsonWebTokenError" ||
            err.name === "TokenExpiredError"
        ) {
            return next();
        }

        next(err);
    }
}

module.exports = {
    foodAuth,
    userAuth,
    optionalUserAuth
};
