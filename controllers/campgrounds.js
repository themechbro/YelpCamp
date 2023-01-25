const campGround= require('../models/campground.js');
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken=process.env.MAPBOX_TOKEN;
const geoCoder=mbxGeocoding({accessToken:mapboxToken});
const { cloudinary }= require('../cloudinary/index');



module.exports.index= async (req, res)=>{
    const camps=await campGround.find({})
    res.render('campgrounds/index', {camps})
 }

 module.exports.rendernewForm=(req, res)=>{
    res.render('campgrounds/new');
}

module.exports.postnewCampground=async (req, res, next)=>{
    const geodata= await geoCoder.forwardGeocode({
      query:req.body.campground.location,
      limit: 1  
    }).send()
    const campground= new campGround(req.body.campground);
    campground.geometry=geodata.body.features[0].geometry;
    campground.image= req.files.map(f =>({url:f.path, filename:f.filename}))
    campground.author=req.user.id
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.showCampground=async (req,res)=>{
    const {id}=req.params;
    const foundCamp = await campGround.findById(id).populate(
       {path:'reviews',
       populate:{
           path:'author'//this one here is a nested populate for each users review.
       }
   }).populate('author');//populate is used to populate the reviews and author linked to a single campground
    if(!foundCamp){
       req.flash('error', 'Cannot find that campground!');
       return res.redirect('/campgrounds');
    }
res.render('campgrounds/show', {foundCamp});
}

module.exports.renderEditForm= async (req, res)=>{
    const {id}= req.params;
    const foundCamp= await campGround.findById(id);
    if(!foundCamp){
       req.flash('error', 'Cannot find that campground!');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {foundCamp});
}

module.exports.postEdit=async(req, res)=>{
    const {id}= req.params;
    console.log(req.body);
    const campground= await campGround.findByIdAndUpdate(id, {...req.body.campground});
    const imgs= req.files.map(f =>({url:f.path, filename:f.filename}));
    campground.image.push(...imgs);
    await campground.save();
    if(req.body.deleteImage){
        for(let filename of req.body.deleteImage){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{image:{filename:{$in: req.body.deleteImage}}}});
    console.log(campground);
    }
    req.flash('success', 'Successfully updated campground ');
    res.redirect(`/campgrounds/${id}`);
    }

module.exports.deleteCampground= async(req, res)=>{
    const {id}=req.params;
    const foundCamp= await campGround.findById(id);
    await foundCamp.delete();
    req.flash('success', 'Successfully Deleted campground');
    res.redirect('/campgrounds');
}    