const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
        name : {type:String, require:true},
        mobile : {type: Number},
        email:{type:String, require:true, unique:true},
        password:{type:String},
        isAdmin : {type:Boolean, default:false},
    },
    {timestamps:true}
);
module.exports = mongoose.model("User", UserSchema);