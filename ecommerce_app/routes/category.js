const express = require("express");
const Category = require("../models/Category");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = express.Router()

router.post("/create-category", verifyTokenAndAdmin, async(req, res)=>{
    try {
        const newCategory = new Category(req.body) 
        const savedCategory = await newCategory.save()
        res.send(savedCategory)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/admin-category", verifyTokenAndAdmin, async(req, res)=>{
    const categories = await Category.find()
    res.render("admin/variant/adminCategory", {categories : categories, session : req.session})
})

router.delete("/category/:id", verifyTokenAndAdmin, async(req, res)=>{
    try {
        await Category.findByIdAndDelete(req.params.id)
        res.status(200).json("Category has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})
router.patch("/category/:id", verifyTokenAndAdmin, async(req, res)=>{
    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id, 
        {
            $set : req.body
        },
        {new : true}
    );
    res.status(200).json(updatedCategory); 
})

module.exports = router;