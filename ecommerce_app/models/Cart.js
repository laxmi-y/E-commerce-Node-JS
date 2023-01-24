const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
    {
        userId : {type:String, require:true},
        products:[
            {
                productId:{type:String},
                quantity:{type:Number, default:1},
                price:{type:Number},
                title : {type:String},
                img:{type:String},
            },  
        ],
    },
    {timestamps:true}
);
module.exports = mongoose.model("Card", CartSchema);