const mongoose= require('mongoose');
const review = require('./review');
const Schema= mongoose.Schema;

const imageSchema= new Schema({
        url:String,
        filename:String
});

imageSchema.virtual('thumbnail').get(function(){  //virtual is used to make partial changes to schema without updating it in the database.
    return this.url.replace('/upload', '/upload/w_200')
});

const opts= { toJSON : {virtuals:true }};
const campgroundSchema= new Schema({
    title:String,
    image:[imageSchema],
    geometry:{
              type:{
               type:String,
               enum: ['Point'],
               required:true
                    },
               coordinates:{
                type:[Number],
                 required:true
                           }
            },

    price: Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){  //virtual is used to make partial changes to schema without updating it in the database.
    return `<strong><a href='/campgrounds/${this.id}'>${this.title} </a></strong>
<p>${this.description.substring(0,20)}....</p>
`
});

campgroundSchema.post('findOneAndDelete', async function (doc){
     if(doc){
        await review.remove({
            id:{$in:doc.reviews}
        })
     } ;
})
module.exports= mongoose.model('Campground', campgroundSchema);