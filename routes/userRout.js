const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { signUp,getlogin,postlogin,logout } = require("../controllers/users.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(signUp))

router.get("/login",getlogin)

 router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,
 }),postlogin);

 router.get("/logout",logout)

module.exports=router;