const User = require('../models/User');
const Update = require('../models/Update'); // Güncelleme modeli eklendi
const bcrypt = require('bcrypt');

// Kullanıcı oluşturma
exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });

    res.status(200).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

// Kullanıcı giriş
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 'fail', message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ status: 'fail', message: 'Incorrect password' });
    }

    req.session.userID = user._id;
    res.status(200).redirect('/users/index');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

// Kullanıcı çıkış
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

// Dashboard sayfası
exports.getDashboardPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const updates = await Update.find();

    const totalUpdates = updates.length;
    const totalTesters = updates.reduce((sum, update) => sum + update.numberOfTesters, 0);

    const highestRetentionUpdate = updates.reduce((max, update) =>
      update.day1Retention > (max.day1Retention || 0) ? update : max, {});

    const highestPurchasesUpdate = updates.reduce((max, update) =>
      (update.purchasesDay1 + update.purchasesDay7 + update.purchasesDay30) >
      (max.purchasesDay1 + max.purchasesDay7 + max.purchasesDay30 || 0) ? update : max, {});


      // Yeni grafikler için gerekli veriler
const totalPurchasesUpdates = updates.map(update => ({
  name: update.name,
  totalPurchases: update.purchasesDay1 + update.purchasesDay7 + update.purchasesDay30,
}));

const averageScreenTimeUpdates = updates.map(update => ({
  name: update.name,
  averageScreenTime:
    (update.averageScreenTimeDay1 +
      update.averageScreenTimeDay7 +
      update.averageScreenTimeDay30) / 3,
}));


    const topTestersUpdates = updates
      .sort((a, b) => b.numberOfTesters - a.numberOfTesters)
      .slice(0, 5);

    const topRetentionUpdates = updates
      .sort((a, b) => b.day1Retention - a.day1Retention)
      .slice(0, 5);

    res.status(200).render('index', {
      page_name: 'index',
      user,
      updates,
      totalUpdates,
      totalTesters,
      highestRetentionUpdate,
      highestPurchasesUpdate,
      topTestersUpdates: JSON.stringify(topTestersUpdates),
  topRetentionUpdates: JSON.stringify(topRetentionUpdates),
  totalPurchasesUpdates: JSON.stringify(totalPurchasesUpdates),
  averageScreenTimeUpdates: JSON.stringify(averageScreenTimeUpdates),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
