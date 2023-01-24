const Token = require("../models/token");
const User = require("../models/User");
const {sendEmail} = require("../utils/sendEmail");
const router = require("express").Router()
const crypto = require("crypto");
const CryptoJs = require('crypto-js')

router.get("/forget-password", (req, res)=>{
    res.render("auth/forgetPassword", {"session" : req.session})
})

router.get("/send/reset-link", (req,res)=>{
    res.render("auth/resetMail")
})

router.get("/password-reset/:userId/:token", (req, res)=>{
    res.render("auth/resetPassword")
})

router.get("/reset-password/success", (req, res)=>{
    res.render("auth/resetPasswordSuccess")
})

router.post("/email/reset-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
        {   
            req.flash('error', "User with given email doesn't exist")
            return res.redirect("/forget-password")
        }
        else{
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
            }
    
            const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
            await sendEmail(user.email, "Password reset", link);
            return res.redirect("/send/reset-link")
        }

    } catch (error) {
        req.flash('error', 'An error occured')
        res.redirect("/forget-password")
    }
});


router.post("/reset-password/:userId/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.send("invalid link or expired")

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.send("invalid link or expired")
        cyptPassword = CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
        user.password = cyptPassword;
        await user.save();
        await token.delete();

        res.send("password reset sucessfully");
    } catch (error) {
        res.send("An error occured");
    }
});


router.get("/change-password", (req, res)=>{
    res.render("auth/changePassword", {session : req.session})
})

router.get("/change-password/success", (req, res)=>{
    res.render("auth/changePasswordSuccess", {session : req.session})
})

router.post('/changepassword', async function (req, res) {
    const user = await User.findOne({email: req.body.email})
    if(!user){
        req.flash('error', "User with given email doesn't exist")
        return res.redirect("/change-password")
    }
    const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
    const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8)
    if(originalPassword != req.body.oldPassword){
        req.flash('error', "Old password not match.")
        return res.redirect("/change-password")
    }
    cyptPassword = CryptoJs.AES.encrypt(req.body.newPassword, process.env.PASS_SEC).toString()
    user.password = cyptPassword;
    await user.save();
    req.session.destroy();
    session = req.session
    return res.redirect("/change-password/success")
});

module.exports = router