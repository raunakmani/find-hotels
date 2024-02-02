const express=require("express");
const router=express.Router({mergeParams:true});
const Listing =require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const Review =require("../models/review.js");
const {validationReview}=require("../middleware.js");
const { addreview ,deleteReview} = require("../controllers/reviews.js");

   // review add rout
   router.post("/",validationReview,wrapAsync(addreview) ) ;
  
  // Delete review rout
  router.delete("/:reviewId",wrapAsync(deleteReview))

  module.exports=router;