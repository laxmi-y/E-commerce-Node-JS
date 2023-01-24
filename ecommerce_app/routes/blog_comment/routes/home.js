const express = require("express")
const { auth } = require("../middleware/guest")
const Blog = require("../models/blog")
const User = require("../models/User")
const Contact = require("../models/Contact")
const router = express.Router()

router.get("/", async(req,res)=>{
    const blogs = await Blog.find();
    res.render("pages/home", {blogs : blogs})
})

router.get("/blog/:id", auth, async(req,res)=>{
    const blog = await Blog.find({_id : req.params.id})
    const blogs = await Blog.find().limit(3);
    res.render("pages/blog-single", {blog : blog, blogs : blogs})
})

router.get("/blogs", auth, async(req,res)=>{
    const blogs = await Blog.find();
    res.render("pages/blogs", {blogs : blogs})
})

router.get("/my-blog", auth, async(req, res)=>{
    const blogs = await Blog.find({userId : req.user._id})
    res.render("pages/my-blogs", {blogs : blogs})
})

router.get("/edit-blog/:id", auth, async(req, res)=>{
    const blog = await Blog.find({_id : req.params.id})
    res.render("pages/edit-blog", {blog : blog})
})

router.get("/createblog", auth, async(req,res)=>{
    res.render("pages/createBlog")
})

router.get("/contact", async(req,res)=>{
    res.render("pages/contact")
})

router.get("/success", auth, async(req,res)=>{
    res.render("pages/success")
})

router.get("/thankyou", async(req,res)=>{
    res.render("pages/thankyou")
})

router.post("/contact-us", async(req,res)=>{
    const contact = {
        name: req.body.name,
        phone:  req.body.phone,
        email:  req.body.email,
        subject:  req.body.subject,
        message:  req.body.message
    }
    try {
        const newContact = new Contact(contact) 
        const savedContact = await newContact.save()
        res.redirect("/thankyou")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router