const express= require('express');

const authController= require('../controllers/authController');
const authMiddleware= require('../middlewares/authMiddleware');
const router= express.Router();

router.route('/signup').post(authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/index').get(authMiddleware,authController.getDashboardPage);
router.route('/analysis').get(authController.getCompareUpdatesPage);
router.route('/tahmin').post(authController.postTahmin);
router.route('/tahmin').get(authController.getTahminPage);

module.exports= router;