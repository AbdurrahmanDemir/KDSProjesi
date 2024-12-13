const express= require('express');

const pageController= require('../controllers/pageController');

const router= express.Router();

router.route('/index.html').get(pageController.getIndexPage);
router.route('/login').get(pageController.getLoginPage);

module.exports= router;