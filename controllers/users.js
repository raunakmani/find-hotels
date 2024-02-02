const User=require("../models/user.js");


module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser= new User({email,username});
        let userRegister=await User.register(newUser,password);
        console.log(userRegister);
        req.login(userRegister,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success"," Register successfuly");
            res.redirect("/listings");
        });
    }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
    }
}

module.exports.getlogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postlogin= (req,res)=>{
    req.flash("success","welcome back to wonderlust");
      res.redirect("/listings");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logout!"),
        res.redirect("/listings");
    })
 }