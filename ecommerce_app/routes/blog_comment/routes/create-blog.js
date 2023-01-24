const express = require("express");
const router = express.Router()
const multer = require("multer");
const Blog = require("../models/blog");
const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error("invalid image type")
        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.split(" ").join("-")
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`)
    }
  })
const uploadOptions = multer({ storage: storage })

router.post("/create-blog", uploadOptions.single("image"), async(req,res)=>{
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
    const blog = {
        userId: req.user._id,
        name:  req.body.name,
        image:  `${basePath}${fileName}`,
        content:  req.body.content
    }
    try {
        const newBlog = new Blog(blog) 
        const savedBlog = await newBlog.save()
        res.redirect("/success")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post("/edit-blog", uploadOptions.single("image"), async(req, res)=>{
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const blog = {
        userId: req.user._id,
        name:  req.body.name,
        image:  `${basePath}${fileName}`,
        content:  req.body.content  
    }

    const updateBlog = await Blog.findByIdAndUpdate(
        req.body.id,
        {
            $set : blog
        },
        {new : true}
    );
    res.redirect("/my-blog")
})

router.get("/delete-blog/:id", async(req, res)=>{
    try {
        await Blog.findByIdAndDelete(req.params.id); 
        res.redirect("/my-blog")
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;