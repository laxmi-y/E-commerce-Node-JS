const express = require("express")
const { sendOtp } = require("../utils/sendEmail")
const otpGenerator = require('otp-generator')

const router = express.Router()

router.get("/send-otp", (req,res)=>{
    res.render("auth/sendOtp", {session : req.session})
})

router.post("/send-otp", (req, res)=>{
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets : false });
    sendOtp(req.body.email, "Email Verification", otp)
    req.session.registerUser = req.body
    req.session.otp = otp
    res.redirect("/send-otp")
})

module.exports = router