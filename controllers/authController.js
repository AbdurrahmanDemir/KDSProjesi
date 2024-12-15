const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Kullanıcı bulunamadı
      return res.status(400).json({ status: 'fail', message: 'User not found' });
    }

    // Şifreyi karşılaştır
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      // Şifre yanlış
      return res.status(400).json({ status: 'fail', message: 'Incorrect password' });
    }

    // Kullanıcı giriş yaptı
    req.session.userID = user._id;
    res.status(200).redirect('/users/index');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(()=> {
    res.redirect('/login');
  })
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({_id:req.session.userID})
  res.status(200).render('index', {
    page_name: 'index',
    user
  });
}; 


