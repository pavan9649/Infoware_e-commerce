const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({
    product_name:{
        type:String,
        required:true
    },
    product_type:{
        type:String,
        required:true
    },
    noOfProduct:{
        type:Number,
        required:true,
        min:0,
        max:300,
        default:0
    },
    addedBy: {
        type: String
    },
});

const Order =mongoose.model("Order",orderSchema);
module.exports=Order;