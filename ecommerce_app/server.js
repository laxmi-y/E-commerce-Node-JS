const express = require("express");
const app = express();
app.set('view engine', 'ejs');
const path = require('path');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()
const stripe = require('stripe')(process.env.SECRET_KEY);
const userAuth = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const sendOtp = require("./routes/sendOtp")
const category = require("./routes/category")
const color = require("./routes/color")
const size = require("./routes/size")
const Category = require("./models/Category");
const Color = require("./models/Color");
const Size = require("./models/Size");
const Order = require("./models/Order");
const Product = require("./models/Product");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./routes/verifyToken");

const User = require('./models/User')
const CryptoJs = require('crypto-js')
const jwt = require("jsonwebtoken");

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var fs = require('fs');
const fileReader = require("filereader");

app.use(express.static(path.resolve(__dirname, "public")));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// session code
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const { getAllProduct, getAllUsers, showCart, getLatestProduct,
    getStartProduct, getStart8Product, updateCard, createOrder,
    getAllOrder, deleteOrder, updateOrder, getSingleProduct,
    getAllCards } = require("./routes/control");
const forgetPassword = require("./routes/password-forget");
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
    rolling: true,
}));

app.use(cookieParser());
// a variable to save a session
var session;
// session code

// google auth
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./routes/passport.js');
app.use(passport.initialize());
app.use(passport.session());

// Auth
app.get('/auth' , passport.authenticate('google', { scope:
	[ 'email', 'profile' ]
}));

// Auth Callback
app.get( '/auth/callback',
	passport.authenticate( 'google', {
		successRedirect: '/auth/callback/success',
		failureRedirect: '/auth/callback/failure'
}));

// Success
app.get('/auth/callback/success' , async(req , res) => {
	if(!req.user)
		res.redirect('/auth/callback/failure');
    let user = null
    user = await User.findOne({email: req.user.email})
    if(!user){
        const newUser = new User({
            name : req.user.displayName,
            email : req.user.email,
        })
        user = await newUser.save()
    }
    const accessToken = jwt.sign(
        {
            id:user._id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SEC,
        {expiresIn:"3d"}
    )
    const {password, ...others} = user._doc
    session=req.session;
    session.userid=user._id;
    session.isAdmin=user.isAdmin;
    session.user=user;
    session.accessToken=accessToken;
    session.isGoogle = true
    res.redirect("/")
});

// global meddleware
app.use(async(req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.session.user
    const carts = await showCart(req, res)
    res.locals.carts = carts
    next()
})

// failure
app.get('/auth/callback/failure' , (req , res) => {
	res.send("Error");
})
//end google auth

mongoose.connect(process.env.MONGO_URL).then(
    () => console.log("DB connection success...!!")).catch((err) => {
        console.log(err)
    });

app.get('/logout', (req, res) => {
    req.session.destroy();
    session = req.session
    res.redirect('/login');
});

app.get('/', async (req, res) => {
    session = req.session;
    const startproducts = await getStartProduct(req, res)
    const latest = await getLatestProduct(req, res)
    const latest8 = await getStart8Product(req, res)
    const products = await getAllProduct(req, res)
    if (session.user) {
        if (session.user.isAdmin) {
            res.render("admin/admin-products", { "session": session, "products": products })
        }
        else {
            res.render("pages/home", {
                "session": session, "products" : products,
                "startproducts": startproducts, "latestProduct": latest,
                "latest8product": latest8,
            })
        }
    }
    else {
        res.render("pages/home", {
            "session": session, "startproducts": startproducts, "products" : products,
            "latestProduct": latest, "latest8product": latest8,
        })
    }
})

app.get('/website', async (req, res) => {
    session = req.session;
    const products = await getAllProduct(req, res)
    if (session.user) {
        if (session.user.isAdmin) {
            res.render("pages/home", {
                "session": session, "products" : products,
            })
        }
    }
})

app.get('/home', async (req, res) => {
    session = req.session;
    const products = await getAllProduct(req, res)
    res.render("pages/home", {
        "session": session, "products" : products,
    })
})

app.post("/create-order", verifyTokenAndAdmin, async (req, res) => {
    const order = await createOrder(req, res)
})

app.post("/update-order", verifyTokenAndAdmin, async (req, res) => {
    const order = await updateOrder(req, res)
    res.redirect("/orders")

})

app.post("/delete-order", verifyTokenAndAdmin, async (req, res) => {
    const order = await deleteOrder(req, res)
    res.redirect("/orders")
})

app.get('/thankyou', (req, res) => {
    res.render('pages/thankyou', { "session": session })
})

app.post('/product-detail', async (req, res) => {
    const product = await getSingleProduct(req, res)
    const latest = await getLatestProduct(req, res)
    res.render('pages/productDetail', {product: product, latestProduct : latest })
})

app.get('/checkout', async (req, res) => {
    const checkouts = await showCart(req, res)
    res.render("pages/checkout", { "session": session, "checkouts": checkouts })
})
app.get("/about", (req, res)=>{
    res.render("pages/about")
})

app.get("/contact", (req, res)=>{
    res.render("pages/contact")
})
app.get('/cart', async (req, res) => {
    const count = await getAllCards(req, res)
    const carts = await showCart(req, res)
    if (session) {
        req.session.reload(function (err) {
            session.carts = count
            res.render("pages/cart", { "session": session, "carts": carts })
        });
    }
    else {
        res.redirect("/login")
    }

})

app.get('/login', (req, res) => {
    res.render('auth/login', { "session": session })
})

app.get('/register', (req, res) => {
    res.render('auth/register', { "session": session })
})


app.get('/shop-category', async(req, res) => {
    const category = await Category.find()
    const products = await Product.find()
    res.render('pages/shopCategory', { "session": session, "category" : category, "products" : products })
})

app.get('/contact', (req, res) => {
    res.render('contact', { "session": session })
})

app.get("/error", (req, res) => {
    res.render("auth/loginError", { "session": session })
})

app.post("/update-quantity", async (req, res) => {
    const updated = await updateCard(req, res)
    res.redirect("/cart")
})

app.post("/charge", async (req, res) => {
    const amount = await createOrder(req, res)
    if (req.body.paymentType == "card") {
        const customer = await stripe.customers
            .create({
                name: req.body.firstname + req.body.lastname,
                email: req.body.email,
                source: req.body.stripeToken
            })
        const intent = await stripe.paymentIntents.create({
            amount: amount.amount * 100,
            currency: 'INR',
            description: 'Payment done by ' + req.body.firstname + " " + req.body.lastname,
            customer: customer.id,
            shipping: {
                name: req.body.firstname + req.body.lastname,
                address: {
                    line1: req.body.add,
                    postal_code: req.body.zip,
                    city: req.body.city,
                    state: req.body.city,
                    country: req.body.country,
                },
            },
        });
        const paymentIntent = await stripe.paymentIntents.confirm(
            intent.id,
            { payment_method: 'pm_card_visa' }
        );
    }
    res.redirect("/thankyou")
});

// admin API
app.get('/dashboard-product', verifyTokenAndAdmin, async (req, res) => {
    products = await getAllProduct(req, res)
    res.render('admin/admin-products', { "session": session, "products": products })
})

app.get('/create-product', verifyTokenAndAdmin, async(req, res) => {
    const category = await Category.find()
    const color = await Color.find()
    const size = await Size.find()
    res.render('admin/admin-create-product', { "session": session, 
        "category" : category,
        "color" : color,
        "size" : size,
    })
})

app.get("/success", (req, res) => {
    res.render("admin/success", { "session": session })
})

app.get('/users', verifyTokenAndAdmin, async (req, res) => {
    const users = await getAllUsers(req, res)
    res.render('admin/users', { "session": session, "users": users })
})

app.get("/profile", verifyTokenAndAdmin, async (req, res) => {
    res.render("admin/profile", { "session": session })
})

app.get("/orders", verifyTokenAndAdmin, async (req, res) => {
    const orders = await getAllOrder(req, res)
    res.render("admin/adminOrder", { "session": session, orders: orders })
})

app.post("/update-profile-admin", verifyTokenAndAdmin, async(req, res)=>{
    User.findOne({_id:req.body.id},(err,doc)=>{
       doc.name = req.body.name;
       doc.email = req.body.email;
       doc.mobile = req.body.phone;
       doc.save(function(err,doc){
            if(doc){
                session.user = doc
                res.send({"success" : true})
            }
            else{
                res.send({"error" : err})
            }
       });
    });
})

app.post("/confirm-payment", verifyTokenAndAdmin, async(req, res)=>{
    const updated = await Order.updateOne(
        { "_id" : req.body.id },
        {$set: { "isPaid" : true }});
    res.redirect("/payments")
})

app.get("/payments", verifyTokenAndAdmin, async(req, res)=>{
    const orders = await getAllOrder(req, res)
    res.render("admin/adminPayment", {"session": session, orders: orders})
})

app.get("/country", async(req, res)=>{
    res.render("pages/country")
})
// admin API

app.use(express.json());

var flash = require('connect-flash');
app.use(flash());
app.use(function(req, res, next){
    res.locals.messages = req.flash();
    next();
  });

app.use("/api/auth", userAuth)
app.use("/api-products", productRoute)
app.use("/api-carts", cartRoute)
app.use("", forgetPassword)
app.use("", sendOtp)
app.use("", category)
app.use("", color)
app.use("", size)
app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on 4000 port");
})