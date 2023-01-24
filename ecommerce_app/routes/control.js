const Cart = require("../models/Cart")
const Product = require("../models/Product")
const User = require("../models/User")
const Order = require("../models/Order")
const { orderConfirm } = require("../utils/sendEmail")

const showCart = async(req, res, next) =>{
    try {
        const cart = await Cart.find({userId : req.session.userid})
        return cart
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateCard = async(req, res, next) =>{
    const cart = await Cart.find({_id : req.body.id})
    try {
        let quant;
        if(req.body.type == "+")
        {
            quant =  parseInt(req.body.quantity) + 1
        }
        else{
            quant =  parseInt(req.body.quantity) - 1
        }
        if(quant == 0)
        {
            await Cart.findByIdAndDelete(req.body.id)
            return true
        }
        else{
            const data = {
                "products" : [
                    {
                        "productId" : cart[0].products[0].productId,
                        "quantity" : quant,
                        "price" : cart[0].products[0].price,
                        "title" : cart[0].products[0].title,
                        "img" : cart[0].products[0].img
                    }
                ]
            } 
            const updatedCart = await Cart.findByIdAndUpdate(
                req.body.id, 
                {
                    $set : data
                },
                {new : true}
            );
            return updatedCart
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
}


const getAllProduct = async(req,res, next) =>{
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
        return products
    } catch (error) {
        res.status(500).json(error)
    }
}

const getProductById = async(req, res, next)=>{
    const product = await Product.findById(req.params.id)
    return product
}

const getAllUsers = async(req, res) =>{
    const query = req.query.new //to get latest 1 user 
    try {
        const users = query ? await User.find().sort({_id : -1}).limit(5) : await User.find()
        // res.status(200).json(users)
        return users
    } catch (error) {
        res.status(500).json(error)
    }
}

const getLatestProduct = async(req,res, next) =>{
    try {
        const products = await Product.find().sort({createdAt : -1}).limit(4)
        return products
    } catch (error) {
        res.status(500).json(error)
    }
}

const getStartProduct = async(req,res, next) =>{
    try {
        const products = await Product.find().sort({createdAt : 1}).limit(3)
        return products
    } catch (error) {
        res.status(500).json(error)
    }
}

const getStart8Product = async(req,res, next) =>{
    try {
        const products = await Product.find().sort({createdAt : 1}).limit(8)
        return products
    } catch (error) {
        res.status(500).json(error)
    }
}

const createOrder = async(req, res)=>{
    const odr = await Order.find().sort({createdAt : -1}).limit(1)
    var next_id 
    if(odr.length == 0){
        next_id = "SO/01"
    }
    else{
        var num = parseInt(odr[0].order_id.split("/")[1]) + 1
        var numStr = num.toString()
        if(numStr.length == 1){
            next_id = "SO/0"+(num).toString()
        }
        else{
            next_id = "SO/"+(num).toString()
        }
    }
    

    const carts = await Cart.find({userId : req.session.userid})
    const products = []
    var amount = 0
    var tatal = 0
    for(var i=0; i<carts.length; i++){
        amount = amount + carts[i].products[0].price * carts[i].products[0].quantity
        products.push(
            {
                "productId" : carts[i].products[0].productId,
                "quantity" : carts[i].products[0].quantity,
                "price" : carts[i].products[0].price,
                "title" : carts[i].products[0].title,
            }
        )
    }
    tatal = amount
    const order = {
        userID : req.session.userid,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        products:products,
        amount:amount,
        paymentType : req.body.paymentType,
        address : {
            country: req.body.country,
            add: req.body.add,
            city: req.body.city,
            zip: req.body.zip
        },      
        status: "pending",
        order_id : next_id
      }
    try {
        const newOrder = new Order(order) 
        const savedOrder = await newOrder.save()
        await Cart.deleteMany({userId : req.session.userid})
        return {amount:tatal}
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAllOrder = async() =>{
    try {
        const orders = await Order.find()
        return orders
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateOrder = async(req, res)=>{
    const user = await User.findById(req.body.userID)
    orderConfirm(user.email, "Confirm Order")
    const updated = await Order.updateOne(
        { "_id" : req.body.id },
        { $set: { "status" : "confirm" } });
    return updated
}

const deleteOrder = async(req, res)=>{
    try {
        await Order.findByIdAndDelete(req.body.id)
        return "Order has been deleted"
    } catch (error) {
        res.status(500).json(error)
    }
}

const getSingleProduct = async(req, res)=>{
    try {
        const product = await Product.findById(req.body.id) 
        return product
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAllCards = async(req,res)=>{
    try {
        const carts = await Cart.find({userId : req.session.userid})
        var count = 0
        for(var i=0; i<carts.length; i++){
            count = count + carts[i].products[0].quantity
        }
        return count
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {showCart, getAllProduct, 
    getAllUsers, getLatestProduct, getStartProduct, getStart8Product,
    updateCard,createOrder,getAllOrder,deleteOrder, updateOrder, getSingleProduct,
    getAllCards,
}