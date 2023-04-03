const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const CryptoJS = require("crypto-js");
const morgan = require("morgan");
const cors = require("cors");
const path =require("path")
const port=process.env.PORT || 3000;
const dotenv=require('dotenv')
app.use(cors());
app.options("*", cors());
//require("./src/db/conn")
//require("dotenv/config");
//middleware


const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const authRoutes=require("./routes/auth");
//dotenv.config({ path: './config.env'})
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("tiny"));

app.use(`/api/auth`,authRoutes);
app.use(`/api/users`, usersRoutes);
app.use(`/api/products`, productsRoutes);
app.get("/",(req,res)=>{
    res.status(200).json({message:"my own project"})
})
app.listen(port,()=>{
    console.log(`server is running at port on ${port}`);
});
