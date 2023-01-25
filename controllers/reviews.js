const campGround= require('../models/campground');
const Review= require('../models/review');

module.exports.createReview=async(req, res)=>{
    const {id}=req.params;
    const camp= await campGround.findById(id);
    const review= new Review(req.body.review);
    review.author=req.user.id;
    camp.reviews.push(review);
   await review.save();
    await camp.save();
    req.flash('success', 'Your review is created')
    res.redirect(`/campgrounds/${camp.id}`);
}

module.exports.deleteReview=async(req, res)=>{
    const {id, reviewId}= req.params;
    await campGround.findByIdAndUpdate(id, {$pull:{reviews:reviewId}}); //$pull is used to take out reviews object from the found campground
   await Review.findByIdAndDelete(reviewId);
   req.flash('success', 'Successfully deleted your review!')
   res.redirect(`/campgrounds/${id}`);
}