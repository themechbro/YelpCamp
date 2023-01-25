const express= require('express');
const router= express.Router();
const campgrounds= require('../controllers/campgrounds');
const catchAsync= require('../utilis/catchAsync');
const multer= require('multer');//package used to parse uploaded image
const {storage}= require('../cloudinary/index');
const upload= multer({ storage });//used to set a destination for uploads


const campGround= require('../models/campground.js');
const{isLoggedin, isAuthor, validateCampground}= require('../middleware');


router.route('/')
.get(catchAsync(campgrounds.index ))
.post(isLoggedin,upload.array('image'),validateCampground, catchAsync(campgrounds.postnewCampground));




 router.get('/new', isLoggedin, campgrounds.rendernewForm);

 router.route('/:id')
 .get( catchAsync(campgrounds.showCampground))
 .put(isLoggedin ,isAuthor, upload.array('image') ,validateCampground, catchAsync(campgrounds.postEdit ))
 .delete( isLoggedin, isAuthor, catchAsync (campgrounds.deleteCampground));
 
 router.get('/:id/edit', isLoggedin, isAuthor, catchAsync (campgrounds.renderEditForm));


 module.exports= router;