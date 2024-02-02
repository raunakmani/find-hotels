const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const path=require("path");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLogin,isOwner,validationListing}=require("../middleware.js");
const { index,show ,create,edit,update,destroy,search} = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })
  
// index.ejs rout
router.get("/",wrapAsync(index));

//new rout
router.get("/new",isLogin,(req,res)=>{
  res.render("listings/new.ejs")
});

//show rout
router.get("/:id",isLogin,wrapAsync(show));

  //create rout,
  router.post('/',isLogin,
  upload.single('listing[image]'),
  validationListing,
   wrapAsync(create));
  //

  // edit rout
  router.get("/:id/edit",isLogin,isOwner,wrapAsync(edit));

  // update rout
  router.put("/:id",isLogin, upload.single('listing[image]'),validationListing,isOwner,wrapAsync(update));

//delete listing
  router.delete("/:id",isLogin,isOwner,wrapAsync(destroy));

  //search
  router.post("/search",wrapAsync(search));

  module.exports=router;