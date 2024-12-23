const express= require('express');

const pageController= require('../controllers/pageController');
const redirectMiddleware = require('../middlewares/redirectMiddleware');
const router= express.Router();

router.route('/index').get(pageController.getIndexPage);
router.route('/login').get(redirectMiddleware,pageController.getLoginPage);
router.route('/register').get(redirectMiddleware, pageController.getRegisterPage);
router.route('/newupdate').get(pageController.getNewUpdatePage);
router.route('/analysis').get(pageController.getAnalysisPage);

module.exports= router;