const express = require("express")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const passport = require("passport")
const {guest} = require("../middleware/guest")
const router = express.Router()

router.get("/register", guest, (req,res)=>{
    res.render("pages/register")   
})

router.get("/login", guest, (req,res)=>{
    res.render("pages/login")
})

router.post("/register", async(req,res)=>{
    const {name, email, password, phone} = req.body
    // validation error
    if(!name || !email || !password || !phone){
        req.flash('error', 'All fields are required...!!')
        req.flash('name', name)
        req.flash('email', email)
        req.flash('email', phone)
        return res.redirect("/register")
    }

    // check if email exists
    User.exists({email : email}, (err, result)=>{
        if(result){
            req.flash('error', 'Email already exists')
            req.flash('name', name)
            req.flash('email', email)
            req.flash('email', phone)
            return res.redirect("/register")
        }
    })

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    //create user
    const user = new User({
        name : name,
        email : email,
        phone : phone,
        password : hashedPassword
    })

    user.save().then((user)=>{
        //login
        return res.redirect("/login")
    }).catch(err=>{
        req.flash('error', 'Something went wrong')
        return res.redirect("/register")
    })
    
})

router.post("/login", (req,res,next)=>{
    passport.authenticate('local', (err, user, info)=>{
        if(err){
            req.flash("error", info.message)
            return next(err)
        }
        if(!user){
            req.flash("error", info.message)
            return res.redirect("/login")
        }

        if(user.block){
            req.flash("error", "Your account is blocked by admin")
            return res.redirect("/login")
        }

        req.logIn(user, (err)=>{
            if(err)
            {
                req.flash("error", info.message)
                return next(err)
            }
            return res.redirect("/")
        })
    })(req, res, next)
})

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
});

router.get("/users", async(req, res)=>{
    const users = await User.find()
    res.render("pages/users", {users: users})
})

router.get("/block-user/:id", async(req, res)=>{
    await User.findByIdAndUpdate(
        req.params.id,
        {$set : {block : true}},
        {new : true}
    )
    res.redirect("/users")
})

router.get("/unblock-user/:id", async(req, res)=>{
    await User.findByIdAndUpdate(
        req.params.id,
        {$set : {block : false}},
        {new : true}
    )
    res.redirect("/users")
})



router.get("/delete-user/:id", async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/users")
})

module.exports = router