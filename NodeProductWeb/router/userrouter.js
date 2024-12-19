const express = require('express');
const router = express.Router();
const User  = require('../model/users')
const Product = require('../model/products')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require("../middleware/auth")
const multer = require('multer')
const fs = require('fs');
const { log } = require('console');


router.get('/', (req, res) => {
  res.render("index")
});

router.post('/reg', async(req, res) => {

  try {
    const user = new User(req.body)
    await user.save()

  res.render("index",{"msg": "registration successfully"})
  } catch (error) {
    console.log(error);
    res.render("index",{"err":"Something Went Wrong"});
  }

  
});

router.get("/login",async(req,resp)=>{
  resp.render("login")
})

router.get("/products",auth,async(req,resp)=>{
 try {
  resp.render("products")
 } catch (error) {
  console.log(error);
 }
}
)
router.post("/userlogin",async(req,resp)=>{
  
  
  try {
    const user = await User.findOne({email:req.body.email})

    if(user.Tokens.length>=3)
      {
          resp.render("login",{"err":"Max user limit reached !!!!"})
          return;
      }
    
    if(user){
      isvalid = await bcrypt.compare(req.body.password,user.password)
      if(isvalid){
        // const token = await jwt.sign({_id:user._id},process.env.S_KEY)
        const token = await user.generateToken()
        
        
        resp.cookie("token",token)
        resp.redirect("home")
      }
      else{
        resp.render("login",{"err":"Invalid email or Password"})
      }
    }
    else{
      resp.render("login",{"err":"Invalid email or Password"})
    }
  } catch (error) {
    console.log(error);
    resp.render("login",{"err":"something went wrong"})
  }
})

module.exports = router