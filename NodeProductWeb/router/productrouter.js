const express = require('express')
const router = express.Router()
const User = require('../model/users')
const Product = require('../model/products')
const auth = require('../middleware/auth')
const jwt = require("jsonwebtoken")

router.post('/addProducts',async(req,resp)=>{

  try {
    id = req.body.id

    if(id){
      const dt = await Product.findByIdAndUpdate(id,req.body)

      resp.render("products",{"msg": "updation successfully"})
    }
    else{
    const user = new Product(req.body);
    await user.save();
    resp.render("products",{"msg": "Product Add successfully"});
  }
 }
 catch (error) {
    console.log(error);
    resp.render("index",{"err":"Something Went Wrong"});
  }
} )

router.get("/home",auth,async(req,resp)=>{
  try {
      const products = await Product.find()
      resp.render("home",{"data":products})
  } catch (error) {
      console.log(error);
  }
})

router.get("/delete",auth,async(req,resp)=>{
  const id = req.query.id;
 
  
  try {
    const dt = await Product.findByIdAndDelete(id)
    
    resp.redirect("/home")
  } catch (error) {
    console.log(error);
    
  }
  
  
})


router.get("/update",auth,async(req,resp)=>{
  const id = req.query.id;
  try {
    const dt = await Product.findById(id)
    resp.render("products",{"data":dt})
  } catch (error) {
    console.log(error);
    
  }
})

router.get("/logout",auth,(req,resp)=>{
  const user = req.user
  const token = req.token

  
  user.Tokens =  user.Tokens.filter(ele=>{
      return ele.token != token
  })
  user.save()
  resp.clearCookie("token")
  resp.render("login")
})

router.get("/logoutall",auth,(req,resp)=>{

  const user = req.user
  const token = req.token

  
  user.Tokens =  [];
  user.save()
  resp.clearCookie("token")
  resp.render("login")
})

module.exports = router