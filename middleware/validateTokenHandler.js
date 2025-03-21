//validateTokenHandler.js
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader =await req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("Decoded token:", decoded);
            req.user = decoded.user;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Unauthorized, token failed");
        }
    } else {
        res.status(401);
        throw new Error("Unauthorized, no token provided");
    }
});
module.exports = validateToken;