
require("dotenv").config();

const express = require("express");
const authroutes = require("./routes/auth.routes");
const foodroutes = require("./routes/food.routes");
const cookieparser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieparser());

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use("/api/auth", authroutes);
app.use("/api/food", foodroutes);

app.get("/", (req, res) => {
    res.send("Foodi API is running!");
});

module.exports = app;
