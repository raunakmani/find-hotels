if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}

const express= require("express");  
const app = express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require('method-override');
const ejsmate=require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review =require("./models/review.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviewroute.js");
const userRouter=require("./routes/userRout.js");
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/user.js");
const Listing = require('./models/listing.js');


// db connection
//const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl=process.env.ATLAUS_DB;

main()
  .then(()=>{
    console.log("conected to DB");
  })
  .catch((err)=>{
    console.log(err);
  })
async function main(){
await mongoose.connect(dbUrl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);

app.use(express.static(path.join(__dirname,"/public")));
console.log("the static is working")

const store=  MongoStore.create({ 
  mongoUrl: dbUrl,
  crypto:{
    secret:process.env.SECERET,
  },
  touchAfter:24*3600,
 })

const sessionOption={
  store,
  secret:"mysupersecretcode",
resave:false,
saveUninitialized:true,
cookie:{
  expires:Date.now()+7*24*60*60*1000,
  maxAge:7*24*60*60*1000,
  httpOnly:true,
}
};

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION ")
})
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curruser=req.user;
  next();
})



// app.get("/demouser",async(req,res)=>{
//   let fakeuser= new User({
//     email:"student@gmail.com",
//     username:"mohit",
//   })
//   let registeredUser=await User.register(fakeuser,"helloword");
// res.send(registeredUser);

// })


// app.get("/",(req,res)=>{
//   res.send("hello i am root");
// })


app.use("/listings",listingsRouter)
 app.use("/listings/:id/reviews",reviewsRouter)
 app.use("/",userRouter)

// testing of listing model
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my city",
//         description:" the beauty of old lucknow",
//         price:1300,
//         location:"chawk roomi gate",
//         county:"india",
//     });
// const savedata=await sampleListing.save();
// console.log("sample is saved");
// res.send("successful testing");
// console.log(savedata);
// })
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found here bro"));
});
app.use((err,req,res,next)=>{
let {statusCode=500,message="something went wrong "}=err;   
res.render("listings/error.ejs",{message});
  // res.status(statusCode).send(message);
})




app.listen(8080,()=>{
    console.log("the port is working");
});