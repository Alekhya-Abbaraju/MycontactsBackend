//userController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
    try{
        const { username, email, password } = await req.body;
        if (!username || !email || !password) {
            res.status(400);
            throw new Error("All fields are mandatory");
        }
        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            res.status(400);
            throw new Error("User already registered");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password", hashPassword);
        const user = await User.create({
            username,
            email,
            password: hashPassword,
        });
        console.log(`User created ${user}`);
        if (user) {
            res.status(201).json({ _id: user.id, email: user.email });
        } else {
            res.status(400);
            throw new Error("User data is not valid");
        }
    }catch(error){
        res.status(500).json({error:error.message})
    }
    
});

// POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error("All fields are mandatory");
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401);
            throw new Error("Email or password is not valid");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (user && passwordMatch) {
            const accessToken = jwt.sign(
                {
                    user: {
                        username: user.username,
                        email: user.email,
                        id: user.id,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            );
            res.status(200).json({ accessToken });
        } else {
            res.status(401);
            throw new Error("Email or password is not valid");
        }
    }catch(error){
        res.status(500).json({error:error.message})
    }
    
});

// GET /api/users/current
const currentUser = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.user.id).select('-password');
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(401);
        throw new Error("Unauthorized");
    }
});

module.exports = { registerUser, loginUser, currentUser };