var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('Usuarios');

router.get('/perfil', function(req, res, next){
  return res.render('cuenta/perfil',{
    title: 'Perfil',
    usuario: req.user,
  });
});

router.post('/perfil', function(req, res, next){
  var query = { '_id':req.user._id };
  User.findByIdAndUpdate( query,req.body,{new: true},
    (err2, todo) => {
      if (err2) return res.status(500).send(err2);
      res.redirect('/home');
    }
  )
});

router.get('/cambiar-contrasena', function(req, res, next){
  return res.render('cuenta/cambiar-contrasena',{
    title: 'Cambiar Contrasena',
    usuario: req.user,
  });
});

router.post('/perfil', function(req, res, next){
  var query = { '_id':req.user._id };
  var salt = req.user.salt;
  var hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');
  User.findByIdAndUpdate( query,{hash: hash},{new: true},
    (err2, todo) => {
      if (err2) return res.status(500).send(err2);
      res.redirect('/home');
    }
  )
});

module.exports = router;