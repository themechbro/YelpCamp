const {campgroundSchema, reviewSchema}= require('./schemas');
const ExpressError=require('./utilis/expresserror');
const campGround=require('./models/campground');
const Review= require('./models/review');

module.exports.isLoggedin= (req, res, next)=>{ // isLoggedin function is to use inorder to restrict access to some page ie you can acccess these pages after logging in.
    if(!req.isAuthenticated()){ // isAuthenticated is used to check whether any user is logged in or not
        req.session.returnTo= req.originalUrl; // req.originalUrl is used to track the path .
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor= async(req, res,next)=>{//this function is used to check whether the author of the post is logged in or not.
    const {id}= req.params;
    const campground= await campGround.findById(id);
    if(!campground.author.equals(req.user.id)){
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/campgrounds/${id}`) 
    }
    next();
}

module.exports.validateCampground= (req,res,next)=>{
        
    const {error}=campgroundSchema.validate(req.body);
   if(error){
     const msg= error.details.map(el => el.message).join(',');
     throw new ExpressError(msg, 400)
   }else{
    next();
   }
}

module.exports.validateReview= (req, res, next)=>{
    const{error}= reviewSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)  
    }else{
        next();
    }
    }

    module.exports.isReviewAuthor= async(req, res,next)=>{//this function is used to check whether the author of the review is logged in or not.
        const {id, reviewId}= req.params;
        const reviews= await Review.findById(reviewId);
        if(!reviews.author.equals(req.user.id)){
            req.flash('error', 'You do not have the permission to do that!');
            return res.redirect(`/campgrounds/${id}`) 
        }
        next();
    }