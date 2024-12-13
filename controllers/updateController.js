 const Update= require('../models/Update');

 exports.createUpdate= async (req, res) => {
    const update= await Update.create(req.body);

    try{
        res.status(201).json({
            status: 'success',
            update,
        });
    }catch{
        res.status(400).json({
            status: 'fail',
            error,
            
        });
    }

 };
