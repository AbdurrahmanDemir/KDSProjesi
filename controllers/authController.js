const User = require('../models/User');
const Update = require('../models/Update'); // Güncelleme modeli eklendi
const bcrypt = require('bcrypt');

// Kullanıcı oluşturma
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body); // Tekrar hashleme yapılmadı
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
      return res.status(400).json({ status: 'fail', message: 'Email not registered' });
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
    // Oturum açmış kullanıcıyı al
    const user = await User.findById(req.session.userID);

    // Sadece oturum açmış kullanıcıya ait güncellemeleri al
    const updates = await Update.find({ user: req.session.userID });

    // Eğer slug varsa, ilgili güncellemeyi al
    const update = req.params.slug
      ? await Update.findOne({ slug: req.params.slug, user: req.session.userID }).populate('user')
      : null;

    // Toplam güncelleme sayısı
    const totalUpdates = updates.length;

    // Toplam test kullanıcıları
    const totalTesters = updates.reduce((sum, update) => sum + update.numberOfTesters, 0);

    // En yüksek tutma oranına sahip güncelleme
    const highestRetentionUpdate = updates.reduce((max, update) =>
      update.day1Retention > (max.day1Retention || 0) ? update : max, {});

    // En yüksek satın alma sayısına sahip güncelleme
    const highestPurchasesUpdate = updates.reduce((max, update) =>
      (update.purchasesDay1 + update.purchasesDay7 + update.purchasesDay30) >
      (max.purchasesDay1 + max.purchasesDay7 + max.purchasesDay30 || 0) ? update : max, {});

    // Grafik verileri için gerekli hesaplamalar
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

    // En çok test edilen güncellemeler
    const topTestersUpdates = updates
      .sort((a, b) => b.numberOfTesters - a.numberOfTesters)
      .slice(0, 5);

    // En yüksek tutma oranına sahip güncellemeler
    const topRetentionUpdates = updates
      .sort((a, b) => b.day1Retention - a.day1Retention)
      .slice(0, 5);

    res.status(200).render('index', {
      page_name: 'index',
      user,
      update,
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

exports.getCompareUpdatesPage = async (req, res) => {
  try {
    // Tüm güncellemeleri alın
    const updates = await Update.find({ user: req.session.userID });

    // Seçili güncellemeleri kontrol edin
    const { update1, update2, statistics } = req.query;

    const selectedUpdates = update1 && update2
      ? await Update.find({
          _id: { $in: [update1, update2] },
          user: req.session.userID,
        })
      : [];

    // `statistics`'i array formatında kontrol edin
    const selectedStatistics = Array.isArray(statistics) ? statistics : [statistics];

    // EJS dosyasına gönderilecek veriler
    res.status(200).render('analysis', {
      updates, // Tüm güncellemeler
      selectedUpdates, // Seçilen iki güncelleme
      statistics: selectedStatistics, // Seçilen istatistikler
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getTahminPage = async (req, res) => {
  try {
    // Kullanıcıya ait güncellemeleri al
    const updates = await Update.find({ user: req.session.userID });

    // updates değişkenini tahmin.ejs dosyasına gönderin
    res.status(200).render('tahmin', { 
      updates, 
      tahminSonucu: null 
    });
  } catch (error) {
    console.error('Error in getTahminPage:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.postTahmin = async (req, res) => {
  try {
    const { updateId, statistic } = req.body;

    // Güncellemeyi al
    const update = await Update.findById(updateId);

    if (!update) {
      return res.status(404).send('Update not found');
    }

    const data = {
      retention: [update.day1Retention, update.day7Retention, update.day30Retention],
      averageScreenTime: [
        update.averageScreenTimeDay1,
        update.averageScreenTimeDay7,
        update.averageScreenTimeDay30,
      ],
      purchases: [update.purchasesDay1, update.purchasesDay7, update.purchasesDay30],
    };

    if (!data[statistic]) {
      return res.status(400).send('Invalid statistic selected');
    }

    const selectedData = data[statistic];

    // Basit bir tahminleme (lineer artış varsayımı)
    const day60 = selectedData[2] + (selectedData[2] - selectedData[1]) * 2;
    const day90 = day60 + (day60 - selectedData[2]) * 1.5;
    const day180 = day90 + (day90 - day60) * 2;
    const day360 = day180 + (day180 - day90) * 2;

    res.status(200).render('tahmin', {
      updates: await Update.find({ user: req.session.userID }),
      tahminSonucu: {
        statistic,
        day1: selectedData[0],
        day7: selectedData[1],
        day30: selectedData[2],
        day60,
        day90,
        day180,
        day360,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};






