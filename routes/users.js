const express= require('express');
const passport = require('passport');
const router= express.Router();
const catchAsync= require('../utilis/catchAsync');
const users= require('../controllers/users');


router.route('/register')
.get( users.renderregisterForm )
.post(catchAsync(users.postregisterForm));


router.route('/login')
.get(users.renderLoginForm)
.post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), users.postLoginForm);


router.get('/logout', users.logout);

module.exports= router;