const Token = require("../models/Token");
const User = require("../models/User");
const {sendEmail} = require("../utils/sendEmail");
const router = require("express").Router()
const crypto = require("crypto");
const bcrypt = require("bcrypt")

router.get("/forget-password", (req, res)=>{
    res.render("pages/forgetPassword", {"session" : req.session})
})

router.get("/send/reset-link", (req,res)=>{
    res.render("pages/resetMail")
})

router.get("/password-reset/:userId/:token", (req, res)=>{
    res.render("pages/resetPassword")
})

router.get("/reset-password/success", (req, res)=>{
    res.render("pages/resetPasswordSuccess")
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
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        user.password = hashedPassword;
        await user.save();
        await token.delete();

        res.send("password reset sucessfully");
    } catch (error) {
        console.log(error)
        res.send("An error occured");
    }
});


router.post("/update-profile", async(req, res)=>{
    User.findOne({_id:req.body.id},(err,doc)=>{
       doc.name = req.body.name;
       doc.email = req.body.email;
       doc.phone = req.body.phone;
       doc.save(function(err,doc){
            if(doc){
                res.send({"success" : true})
            }
            else{
                res.send({"error" : err})
            }
       });
    });
})


module.exports = router