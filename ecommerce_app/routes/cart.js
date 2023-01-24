const Cart = require("../models/Cart")
const { showCart } = require("./control")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const router = require("express").Router()



// Create Cart
router.post("/add", verifyToken, async(req,res)=>{
    const find = await Cart.find({userId : req.body.userId})
    if(find.length > 0)
    {
        var isAdded = false
        for (let i = 0; i < find.length; i++) {
            if(find[i].products[0].productId == req.body.productId)
            {
                isAdded = true
                const data = {
                    "products" : [
                        {
                            "productId" : find[i].products[0].productId,
                            "quantity" : find[i].products[0].quantity + 1,
                            "price" : find[i].products[0].price,
                            "title" : find[i].products[0].title,
                            "img" : find[i].products[0].img
                        }
                    ]
                } 
                const updatedCart = await Cart.findByIdAndUpdate(
                    find[i]._id, 
                    {
                        $set : data
                    },
                    {new : true}
                );    
            }
        }
        if(isAdded != true)
        {
            isAdded = true
            try {
                const data = {
                    "userId" : req.body.userId,
                    "products" : [
                        {
                            "productId" : req.body.productId,
                            "quantity" : req.body.quantity,
                            "price" : req.body.price,
                            "title" : req.body.title,
                            "img" : req.body.img
                        }
                    ]
                } 
                const newCart = new Cart(data) 
                const savedCart = await newCart.save() 
            } catch (error) {
                res.status(500).json(error)
            }
        }
        res.redirect("/cart")
    }
    else{
        try {
            const data = {
                "userId" : req.body.userId,
                "products" : [
                    {
                        "productId" : req.body.productId,
                        "quantity" : 1,
                        "price" : req.body.price,
                        "title" : req.body.title,
                        "img" : req.body.img
                    }
                ]
            } 
            const newCart = new Cart(data) 
            const savedCart = await newCart.save() 
            res.redirect("/cart")
        } catch (error) {
            res.status(500).json(error)
        }
    }
})

router.get("/show", verifyToken, async(req, res)=>{
    res.redirect("/cart")
})

module.exports = router;