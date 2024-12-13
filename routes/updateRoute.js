const express= require('express');

const updateController= require('../controllers/updateController');

const router= express.Router();

router.route('/').post(updateController.createUpdate);

module.exports= router;