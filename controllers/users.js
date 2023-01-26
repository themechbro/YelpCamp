const User= require('../models/user');

module.exports.renderregisterForm=(req, res)=>{
    res.render('users/register');
}

module.exports.postregisterForm=async(req, res)=>{
    try{
const {email, username, password}= req.body;// this destructures email username and password
const user= new User({email, username}); // this is used to create mongo model, we use only email and username because rest is defined in userSchema Plugin in models>user.js
const registerUser= await User.register(user, password);// this line of code is used to hash password using passport and not by using bcrypt.
req.login(registerUser, err =>{     //req.login is used to directly login to account after registration
    if(err) return next(err);
    req.flash('success','Welcome to YelpCamp, your account was successfully created.');
res.redirect('/campgrounds');
})

    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLoginForm=(req, res)=>{
    res.render('users/login');
}

module.exports.postLoginForm=(req, res) =>{
    req.flash('success', `Welcome Back ${req.user.username}!`);
    const redirectUrl= req.session.returnTo || '/campgrounds'; //req.session.returnTo is used to store the url that we tried to access without log in this is setup in middleware.js
    res.redirect(redirectUrl);
    }

    module.exports.logout=(req, res, next)=>{
        req.logout();
            req.flash('success', 'Successfully logged you out');
            res.redirect('/campgrounds');
        
    }
    
    
