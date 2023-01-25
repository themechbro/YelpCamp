const mongoose= require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser:true, 
    useUnifiedTopology:true
}).then(()=>{
    console.log(" Mongo Connection open")
})
.catch(err=>{
console.log("Mongo Error");
console.log(err);
});
const campGround= require('../models/campground.js');
const cities= require('./cities');
const {places, descriptors}= require('./seedHelpers');

const sample= array => array[Math.floor(Math.random() * array.length)];



const seedDb= async()=>{
    await campGround.deleteMany({});
    for(let i=0; i<200; i++){
        const price=Math.floor(Math.random()*20)+10;
        const random1000=Math.floor(Math.random()*1000);
        const camp=new campGround({
            author:'63b95e143dae7f4cda17a3e4', //bears userid in db
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore et facilis eveniet quod sequi quae praesentium dolore ut architecto officia aperiam beatae in, dolorum maxime quasi, nisi soluta ab nam?',
            price,
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude,cities[random1000].latitude ] },
            image:[
                {
                    url: 'https://res.cloudinary.com/dmp6n2rjm/image/upload/v1673614077/YelpCamp/rohzlzcplsrjueqxosij.png',     
                    filename: 'YelpCamp/rohzlzcplsrjueqxosij'
                },
                {
                    url: 'https://res.cloudinary.com/dmp6n2rjm/image/upload/v1673614079/YelpCamp/up1x1vloarwyrp6syjub.png',     
                    filename: 'YelpCamp/up1x1vloarwyrp6syjub'
                }
            ]
        });
        await camp.save();
    }
}
seedDb().then(()=>{
    mongoose.connection.close();
})