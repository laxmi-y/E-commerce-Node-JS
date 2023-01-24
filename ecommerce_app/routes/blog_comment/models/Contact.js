const mongoose = require("mongoose");
const Schema = mongoose.Schema
const contactSchema = new Schema({
    name : {type : String, require : true},
    phone : {type : String, require : true},
    email : {type : String, require : true},
    subject : {type : String, require : true},
    message : {type : String, require : true},
}, {timestamps : true})

const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact
