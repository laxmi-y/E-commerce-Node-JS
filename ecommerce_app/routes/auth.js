const router = require("express").Router()
const { request, json } = require("express");
const User = require('../models/User')
const CryptoJs = require('crypto-js')
const jwt = require("jsonwebtoken");
const { getAllCards } = require("./control");

// Create user
router.post('/register', async(req,res)=>{
    //verify otp
    const otp = req.body.first + req.body.second + req.body.third + req.body.forth
    if(req.session.otp != parseInt(otp)){
        req.flash('error', "Wrong OTP submitted")
        res.redirect("/send-otp")
    }
    else{
        const newUser = new User({
            name : req.session.registerUser.name,
            mobile : req.session.registerUser.mobile,
            email : req.session.registerUser.email,
            password : CryptoJs.AES.encrypt(req.session.registerUser.password, process.env.PASS_SEC).toString(),
        })
        try {
            const savedUser = await newUser.save()
            res.redirect("/login")
        } catch (error) {
            console.log(error)
            res.redirect("/register")
        }
    }
})

// Login user
router.post('/login', async(req,res)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user){
            res.redirect("/error")
        }
        else{
            const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
            const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8)
            if(originalPassword != req.body.password){
                res.redirect("/error")
            }
            else{
                const accessToken = jwt.sign(
                    {
                        id:user._id,
                        isAdmin: user.isAdmin
                    },
                    process.env.JWT_SEC,
                    {expiresIn:"3d"}
                )
                const {password, ...others} = user._doc
                session=req.session;
                session.userid=user._id;
                session.isAdmin=user.isAdmin;
                session.user=user;
                session.accessToken=accessToken;
                const carts = await getAllCards(req,res)
                session.carts = carts
                res.redirect("/")    
            }   
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})
module.exports = router;