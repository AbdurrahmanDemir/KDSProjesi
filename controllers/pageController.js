exports.getIndexPage= (req, res)=>{
    res.status(200).render('index');
};

exports.getLoginPage= (req, res)=>{
    res.status(200).render('login');
};

exports.getRegisterPage= (req, res)=>{
    res.status(200).render('register');
};

exports.getNewUpdatePage= (req, res)=>{
    res.status(200).render('newupdate');
};
exports.getAnalysisPage= (req, res)=>{
    res.status(200).render('analysis');
};
exports.getTahminPage= (req, res)=>{
    res.status(200).render('tahmin');
};