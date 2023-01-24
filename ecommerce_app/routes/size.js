const express = require("express");
const Size = require("../models/Size");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = express.Router()

router.post("/create-size", verifyTokenAndAdmin, async(req, res)=>{
    try {
        const newSize = new Size(req.body) 
        const savedSize = await newSize.save()
        res.send(savedSize)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/admin-size", verifyTokenAndAdmin, async(req, res)=>{
    const sizes = await Size.find()
    res.render("admin/variant/adminSize", {sizes : sizes, session : req.session})
})

router.delete("/size/:id", verifyTokenAndAdmin, async(req, res)=>{
    try {
        await Size.findByIdAndDelete(req.params.id)
        res.status(200).json("Size has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

router.patch("/size/:id", verifyTokenAndAdmin, async(req, res)=>{
    const updatedSize = await Size.findByIdAndUpdate(
        req.params.id, 
        {
            $set : req.body
        },
        {new : true}
    );
    res.status(200).json(updatedSize); 
})

module.exports = router;