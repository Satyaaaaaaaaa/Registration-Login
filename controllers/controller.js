const userModel = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const login = async(req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(403)
            .json({
                message: "Create an account to login!", 
                success: false
            });
        }
        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if(!isPasswordEqual){
            return res.status(403)
                .json({
                    message: "Wrong Password!", 
                    success: false                    
                })
        }
        const jwtToken = jwt.sign(
            {email: user.email, _id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )
        res.status(201)
            .json({
                message: "login sucessfull",
                success:true,
                jwtToken,
                email,
                name: user.name
            });
    }catch(err){
        res.status(500)
            .json({
                message: "An error occured",
                error: err.message,
                sucess: false
            });
    }
}

const signup = async(req, res) =>{
    try{
        
        const {name, email, password} = req.body;
        const user = await userModel.findOne({email});

        if(user){
            return res.status(409)
            .json({
                message: "User already exists", 
                success: false
            });
        }

        const newUser = new userModel({name, email, password});
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();

        res.status(201)
            .json({
                message: "Signup sucessfull",
                success:true
            });

    }catch(err){
        res.status(500)
            .json({
                message: "An error occured",
                error: err.message,
                sucess: false
            });
    }
}

module.exports = {
    login,
    signup
};