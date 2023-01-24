const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// var createError = require('http-errors');

const session = require('express-session');
const flash = require('connect-flash');
const ejs = require("ejs") 
const mongoose = require("mongoose")
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const createBlog = require('./routes/create-blog');
const forgetPassword = require('./routes/forget-password');

const Comment = require('./models/Comment');

const passport = require("passport")
const path = require("path")
app.set("view engine", "ejs")

//configure env
const dotenv = require("dotenv");
dotenv.config()

// for show data and read body post data
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//store session on DB
const MongoDbStore = require('connect-mongo');
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'blablabla',
  store: MongoDbStore.create({
    mongoUrl: "mongodb://localhost:27017/blog-comment"
})
}));
  
//passport config
const passportInit = require('./config/passport');
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());

// global meddleware
app.use((req,res,next)=>{
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

//manage next and back request of browser to validate
app.use(function(req, res, next) { 
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   next();
});

app.use(express.static(path.resolve(__dirname, "public")));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

const port = process.env.PORT || 3000;

app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = req.flash();
  next();
});

//database connection
mongoose.connect("mongodb://localhost:27017/blog-comment").then(
  () => console.log("DB connection success...!!")).catch((err) => {
      console.log(err)
  });


//create comment save routes
app.post("/api/comments", (req, res)=>{
  const comment = new Comment({
      username : req.body.username,
      comment : req.body.comment,
      userId : req.user._id,
      blogId : req.body.blogId
  })
  comment.save().then(response =>{
      res.send(response)
  })
})

app.get("/api/comments/:blogId", (req,res)=>{
  Comment.find({'blogId' : req.params.blogId}).then(function(comments){
      res.send(comments)
  })
})

//socket connection 
const io = new Server(server);
io.on("connection", (socket)=>{
  socket.on("comment", (data)=>{
      socket.broadcast.emit("comment", data)
  })
})

// end socket

app.use("", authRouter)
app.use("", homeRouter)
app.use("", forgetPassword)
app.use("", createBlog)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

server.listen(port, (err) => {
  console.log('Server is up and listening on', port);
});