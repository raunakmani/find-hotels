const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you are not login!");
        return res.redirect("/login");
    }else{
        next();
    }
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
req.flash("error","you are not listing owner");
return res.redirect(`/listings/${id}`);
    }
    next()
}

// function of error validation , handle with the joi
module.exports.validationListing =(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((er)=>er.message).join(",")
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  } 

  module.exports.validationReview =(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((er)=>er.message).join(",")
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  } 