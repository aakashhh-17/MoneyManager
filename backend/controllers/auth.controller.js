import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next)=>{
const {email, password, username} = req.body;
try {
    if(!email || !password || !username) return res.status(400).json({success: false, message: "Fill all fields"});

    const existingUser = await User.findOne({email});
    if(existingUser) return res.status(400).json({success: false, message: "User already exists!"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email, 
        password : hashedPassword
    })

    return res.status(201).json({success: true, message: "New user created"});
} catch (error) {
    console.log("Error in signup controller", error);
    return res.status(500).json({success: false, message: "Internal server error"});
}
}


export const signin = async (req, res, next)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({success: false, message: "Fill all fields"});

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({success: false, message: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({success: false, message: "Invalid credentials!"});

        const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })


        return res.status(200).json({success: true, message: "Signed in successfully!"})

    } catch (error) {
        console.log("Error in signin controller", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const logout = async (req, res)=>{
res.clearCookie("token");
res.status(200).json({success: true, message: "Logged out"});
}