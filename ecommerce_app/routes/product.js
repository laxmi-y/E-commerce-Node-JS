const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("./verifyToken");
const mongoose = require("mongoose")
const router = require("express").Router()

const multer = require("multer")
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

// Create Product
router.post("/", uploadOptions.single("img"), verifyTokenAndAdmin, async(req,res)=>{
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const product = {
        title: req.body.title,
        categories:  req.body.categories,
        size:  req.body.size,
        color:  req.body.color,
        price:  req.body.price,
        img:  `${basePath}${fileName}`,
        desc:  req.body.desc
      }
      
    try {
        const newProduct = new Product(product) 
        const savedProduct = await newProduct.save()
        // res.send(savedProduct)
        res.redirect("/success")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.put("/gallery-images/:id", 
    uploadOptions.array("images", 10),
    async(req, res)=>{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).send("Invalid product id")
        }
        const files = req.files
        let imagesPaths = []
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        if(files){
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`);
            })
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images : imagesPaths
            },
            {new : true}
        )
        if(!product){
            res.status(500).send("the product can not be updated")
        }
        res.send(product)
    }
)

// Update
router.put("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            {
                $set : req.body
            },
            {new : true}
        );
        res.status(200).json(updatedProduct); 
    } catch (error) {
        res.status(500).json(error)
    }
})

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})


// Get Product
router.get("/find", async(req, res)=>{
    try {
        const Product = await Product.findById(req.params.id)
        res.status(200).json(Product)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get all Product
router.get("/", async(req, res)=>{
    const qNew = req.query.new //to get latest 1 Product 
    const qCategory = req.query.category
    try {
        let products;
        if(qNew)
        {   
            products = await Product.find().sort({createdAt : -1}).limit(1)
        }
        else if(qCategory){
            products = await Product.find({
                categories : {
                    $in : [qCategory],
                },
            })
        }
        else{
            products = await Product.find();
        }
        res.render('allProducts', {"session" : req.session, "products" : products})

    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;


