const mongoose = require("mongoose");
const Schema = mongoose.Schema
const blogSchema = new Schema({
    userId : {type : Schema.Types.ObjectId, ref: 'User', require : true},
    name : {type : String, require : true},
    image : {type : String, require : true},
    content : {type : String, require : true},
}, {timestamps : true})

const blog = mongoose.model('Blog', blogSchema)
module.exports = blog
