const express = require("express");
const Color = require("../models/Color");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = express.Router()

router.post("/create-color", verifyTokenAndAdmin, async(req, res)=>{
    try {
        const newColor = new Color(req.body) 
        const savedColor = await newColor.save()
        res.send(savedColor)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/admin-color", verifyTokenAndAdmin, async(req, res)=>{
    const colors = await Color.find()
    res.render("admin/variant/adminColor", {colors: colors, session : req.session})
})

router.delete("/color/:id", verifyTokenAndAdmin, async(req, res)=>{
    try {
        await Color.findByIdAndDelete(req.params.id)
        res.status(200).json("Color has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

router.patch("/color/:id", verifyTokenAndAdmin, async(req, res)=>{
    const udatedcolor = await Color.findByIdAndUpdate(
        req.params.id, 
        {
            $set : req.body
        },
        {new : true}
    );
    res.status(200).json(udatedcolor); 
})

module.exports = router;