const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next)=>{
    let token;
    if(req.session)
    {
        token = req.session.accessToken
    }
    if(token)
    {
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err) res.status(403).json("Token is not valid")
            req.user = user;
            next()

        })
    }else if(req.user){
        next()
    }
    else{
        res.redirect("/login")
    }
}

const verifyTokenAndAuthorization = (req, res, next) =>{
    verifyToken(req, res, ()=>{
        if(req.user.id == req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to edit it")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) =>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to do it, you are not admin.")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}