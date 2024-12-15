 const Update= require('../models/Update');

 exports.createUpdate= async (req, res) => {


    try{
    const update= await Update.create(req.body);
    
    res.status(200).redirect('/users/index');
    
    }catch(error){
        res.status(400).json({
            status: 'fail',
            error,
            
        });
    }

 };

 exports.getAllUpdates= async (req, res) => {


    try{
    const updates= await Update.find();
    
        res.status(200).render('updates', {
            updates,
        });
    }catch(error){
        res.status(400).json({
            status: 'fail',
            error,
            
        });
    }
 };
 exports.getUpdate= async (req, res) => {


    try{
    const update= await Update.findOne({slug: req.params.slug});
    
        res.status(200).render('update', {
            update,
        });
    }catch(error){
        res.status(400).json({
            status: 'fail',
            error,
            
        });
    }
 };

 exports.getNewUpdatePage= (req, res)=>{
    res.status(200).render('newupdate');
};