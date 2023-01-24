function guest(req,res,next){
    if(!req.isAuthenticated()){
        return next()
    }
    return res.redirect("/")
}

function auth(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect("/login")
}

module.exports = {guest, auth}