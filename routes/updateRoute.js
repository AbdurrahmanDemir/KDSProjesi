const express= require('express');

const updateController= require('../controllers/updateController');

const router= express.Router();

router.route('/').post(updateController.createUpdate);
router.route('/').get(updateController.getAllUpdates);
router.route('/:slug').get(updateController.getUpdate);

module.exports= router;