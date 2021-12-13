const Product = require("../src/models/products");
const { User } = require("../src/models/user");
const Order  = require("../src/models/orders")
const express = require("express");
//const body = require("body-parser");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.get(`/browseProducts`,  verifyToken, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get(`/viewAllOrders`,verifyTokenAndAdmin, async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get(`/viewOrders`,verifyToken, async (req, res) => {
  const orderList = await Order.find({addedBy:req.user.id});

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});




  
router.post(`/addProduct`,verifyTokenAndAdmin, async(req, res) => {
  let product = new Product({
    product_name: req.body.product_name,
    product_type: req.body.product_type,
    product_description:req.body.product_description,
    product_price:req.body.product_price,
    noOfProduct: req.body.noOfProduct
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});


router.put("/:id",verifyTokenAndAdmin, async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        product_price:req.body.product_price
      },
      { new: true }
    );
  
    if (!product) return res.status(400).send("the product cannot be created");
  
    res.send(product);
  });

  router.post("/orderProduct",verifyToken,async(req,res)=>{
    console.log(req)
      try{
          let product=new Product({
              product_name:req.body.product_name,
              product_type:req.body.product_type,
              noOfProduct:req.body.noOfProduct
          })
          let order=new Order({
              product_name:req.body.product_name,
              product_type:req.body.product_type,
              noOfProduct:req.body.noOfProduct,
              addedBy:req.user.id,

          })
          //console.log(product.countInStock)
          let stock=product.noOfProduct;
          let  currentStock=await Product.findOne({product_name:product.product_name});
         
          let check=currentStock.noOfProduct-stock;
          console.log(check,454);
          if(check<=0)
          {
            return res
              .status(404)
              .json({ success: false, message: "the product not available according to your no of product purchase" });
          }
         
         else if (check) {
          order= await order.save();
          const result =await Product.updateOne({product_name:product.product_name}, {$set:{noOfProduct:(currentStock.noOfProduct-stock)}});

            return res
              .status(200)
              .json({ success: true, message: "the product purchase successful" });
          } else {
            return res
              .status(404)
              .json({ success: false, message: "the product not available" });
          }

      
    }catch(e)
      {
          console.log(e)

      }

  })

router.delete("/:id", (req, res) => {
    Product.findByIdAndRemove(req.params.id)
      .then((product) => {
        if (product) {
          return res
            .status(200)
            .json({ success: true, message: "the product deleted" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "the product not found" });
        }
      })
      .catch((err) => {
        return res.status(400).json({ success: false, error: err });
      });
  });

module.exports = router;