const mongoose = require("mongoose");
const Schema = mongoose.Schema
const commentSchema = new Schema({
    userId : {type : Schema.Types.ObjectId, ref: 'User', require : true},
    username : {type : String, require : true},
    comment : {type : String, require : true},
    blogId : {type : Schema.Types.ObjectId, ref: 'Blog', require : true},
}, {timestamps : true})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
