
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
//dbUrl
//mongodb://127.0.0.1:27017/yelp-camp
const express= require('express');
const app= express();
const path =require('path');
const joi= require('joi');
const ejsMate=require('ejs-mate');
const ExpressError= require('./utilis/expresserror');
const dbUrl=process.env.DB_URL;
const mongoose= require('mongoose');
const session= require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose.connect(dbUrl, {
    useNewUrlParser:true, 
    useUnifiedTopology:true
}).then(()=>{
    console.log(" Mongo Connection open")
})
.catch(err=>{
console.log("Mongo Error");
console.log(err);
});

const methodOverride= require('method-override');
const campgroundRoutes= require('./routes/campgrounds');
const reviewRoutes= require('./routes/reviews');
const flash= require('connect-flash');
const passport= require('passport');
const LocalStrategy= require('passport-local');
const User= require('./models/user');
const userRoutes= require('./routes/users');
const mongoSanitize= require('express-mongo-sanitize');
const helmet= require('helmet');
//------------------------------------------------------------------------------//
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
replaceWith: '_'
}));// this is used to filter out any signs in the query string

const store= new MongoStore({
url:dbUrl,
secret:'thiscouldbeabettersecret',
touchAfter: 24*60*60
});

store.on('error', function(e){
console.log('SESSION STORE ERROR', e);
})

const sessionConfig= {
store,
    name:'Cookie1',
    secret: 'thiscouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + (1000*60*60*24*7),
        maxAge:1000*60*60*24*7,
        httpOnly: true,
        //secure:true
    }
}

app.use(session(sessionConfig));
app.use(flash());
//app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dv5vm4sqh/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmp6n2rjm/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.pexels.com/photos/4268158/pexels-photo-4268158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/5994385/pexels-photo-5994385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dv5vm4sqh/" ],
            childSrc   : [ "blob:" ]
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser=req.user;// req.user is used to check whether user is logged in or not inorder to render logout button on navbar.ejs
    res.locals.success=req.flash('success');//req.flash is used to render flash .ejs in pages
    res.locals.error= req.flash('error');
    next();
})

//__________________________________________________________________________________//


app.get('/fakeUser', async(req, res)=>{
    const user= new User({email:'adrin@gmail.com', username:'adrin'});
    const newUser= await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
app.get('/', (req, res)=>{
    res.render('home');
});





app.all('*', (req, res, next)=>{
    next( new ExpressError('Page not Found', 404));  
});


app.use((err, req, res, next)=>{
    const {statusCode=500}= err;
    if(!err.message) err.message= "Oh Snap, Something went Wrong!!!!!!!"
    res.status(statusCode).render('error', {err});
});


app.listen(3000, (req, res)=>{
    console.log('App running on port 3000');
});
