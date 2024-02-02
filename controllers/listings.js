const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListings=  await Listing.find({});
    res.render("listings/index.ejs",{allListings})
    console.log("listing is working")
}

module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","the listing you are searching does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
    }

    module.exports.create=async(req,res,next)=>{
      let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
      // let info=req.file;
      // console.log(info);
let url=req.file.path;
let filename=req.file.filename;
        const newListing= new Listing(req.body.listing);
        newListing.owner=req.user._id,
        newListing.image={url,filename},
        newListing.geometry=response.body.features[0].geometry;
        let newdata = await newListing.save();
        console.log(newdata)
        req.flash("success","new listing created!");
       res.redirect("/listings");
    }
module.exports.search=async(req,res)=>{
  let info=req.body.searchCity;
  const allListings=  await Listing.find({location:info});
  res.render("listings/index.ejs",{allListings})
}


    module.exports.edit=async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        req.flash("error","not exist!");
        res.render("listings/edit.ejs",{listing});
    }

    module.exports.update=async(req,res)=>{
        let {id}=req.params;
       const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
       if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename},
        await listing.save();
       }
       req.flash("success"," listing updated!");
        res.redirect(`/listings/${id}`);
        console.log("the update is working");
    
      }

      module.exports.destroy=async(req,res)=>{
        let {id}=req.params;
        const deletedlisting =await Listing.findByIdAndDelete(id);
        req.flash("success"," listing deleted!");
        res.redirect("/listings");
        console.log(deletedlisting);
      }