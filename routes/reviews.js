const express= require('express');
const router= express.Router({mergeParams:true});//mergeparams is used to merge multiple params
const {reviewSchema}= require('../schemas');
const catchAsync= require('../utilis/catchAsync');
const ExpressError= require('../utilis/expresserror');
const {validateReview, isLoggedin, isReviewAuthor}= require('../middleware');
const reviews= require('../controllers/reviews');
const Review= require('../models/review')




router.post('/', isLoggedin , validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedin, catchAsync(reviews.deleteReview ));

module.exports= router;