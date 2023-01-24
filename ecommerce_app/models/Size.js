const mongoose = require("mongoose");
const SizeSchema = new mongoose.Schema(
    {
        size : {type:String, require:true},
    },
    {timestamps:true}
);
module.exports = mongoose.model("Size", SizeSchema);