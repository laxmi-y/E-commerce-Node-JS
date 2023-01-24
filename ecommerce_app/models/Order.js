const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
    {
        userID : {type:String, require:true},
        firstname : {type: String, require:true},
        lastname : {type:String, require:true},
        mobile : {type:Number, require : true},
        products:[
            {
                productId:{type:String},
                quantity:{type:Number, default:1},
                title : {type: String},
                price : {type: Number}
            },
        ],
        amount:{type:Number, require:true},
        address:{type:Object, required:true},
        paymentType:{type: String, require:true},
        isPaid : {type:Boolean, default: false},
        status: {type:String, default: "pending"},
        order_id : {type : String}
    },
    {timestamps:true}
);
module.exports = mongoose.model("Order", OrderSchema);