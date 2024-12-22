 const Update= require('../models/Update');
 exports.createUpdate = async (req, res) => {
    try {
      const update = await Update.create({
        name: req.body.name,
        description: req.body.description,
        version: req.body.version, // Version eklenmeli
        day1Retention: req.body.day1Retention, // Eksik alanlar doldurulmalı
        day7Retention: req.body.day7Retention,
        day30Retention: req.body.day30Retention,
        purchasesDay1: req.body.purchasesDay1,
        purchasesDay7: req.body.purchasesDay7,
        purchasesDay30: req.body.purchasesDay30,
        averageScreenTimeDay1: req.body.averageScreenTimeDay1,
        averageScreenTimeDay7: req.body.averageScreenTimeDay7,
        averageScreenTimeDay30: req.body.averageScreenTimeDay30,
        numberOfTesters: req.body.numberOfTesters || 1000, // Varsayılan değer atanabilir
        user: req.session.userID, // Oturum açmış kullanıcıya ait
      });
  
      res.status(200).redirect('/users/index');
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };
  
  exports.getAllUpdates = async (req, res) => {
    try {
      // Sadece oturum açmış kullanıcıya ait güncellemeleri filtrele
      const updates = await Update.find({ user: req.session.userID });
  
      res.status(200).render('updates', {
        updates,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };
  
  
  exports.getUpdate = async (req, res) => {
    try {
      // Hem slug hem de user kimliğiyle sorgula
      const update = await Update.findOne({
        slug: req.params.slug,
        user: req.session.userID,
      });
  
      // Güncelleme bulunamadıysa veya başka bir kullanıcıya aitse hata döndür
      if (!update) {
        return res.status(404).send('Update not found or you are not authorized to view this update.');
      }
  
      res.status(200).render('update', {
        update,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };
  
 exports.getNewUpdatePage= (req, res)=>{
    res.status(200).render('newupdate');
 };
 