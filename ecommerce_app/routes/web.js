const express = require("express")
const router = express.Router()

router.get("/", (req, res)=>{
    res.render("pages/home")
})

router.get("/shop-category", (req, res)=>{
    res.render("pages/shopCategory")
})

router.get("/cart", (req, res)=>{
    res.render("pages/cart")
})

router.get("/about", (req, res)=>{
    res.render("pages/about")
})

router.get("/contact", (req, res)=>{
    res.render("pages/contact")
})

router.get("/login", (req, res)=>{
    res.render("auth/login")
})

router.get("/register", (req, res)=>{
    res.render("auth/register")
})

module.exports = router