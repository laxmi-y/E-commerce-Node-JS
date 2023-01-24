const mongoose = require("mongoose");
const ColorSchema = new mongoose.Schema(
    {
        color : {type:String, require:true},
    },
    {timestamps:true}
);
module.exports = mongoose.model("Color", ColorSchema);