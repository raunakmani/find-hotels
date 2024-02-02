const Listing =require("../models/listing.js");
const Review =require("../models/review.js");


module.exports.addreview=async(req,res)=>{
    let {id}=req.params;
    let findlistingid= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    console.log(newReview)
    findlistingid.reviews.push(newReview);     
    await newReview.save();
    await findlistingid.save();
     res.redirect(`/listings/${id}`)
  }

  module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    const deleteid=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});    
    const delrev=await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`)
  }