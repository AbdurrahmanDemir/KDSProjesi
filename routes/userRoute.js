const express= require('express');

const authController= require('../controllers/authController');

const router= express.Router();

router.route('/signup').get(authController.createUser);
module.exports= router;