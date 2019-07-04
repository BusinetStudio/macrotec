var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('Usuarios');
var crypto = require('crypto');

  
router.get('/todos', function(req, res, next){
  User.find().then(function(result){
    if(!result){ return res.sendStatus(401); }
    return res.render('usuarios/todos',{
      title: 'Usuarios',
      usuarios: result,
      usuario: req.user
    });
  }).catch(next);
});
router.get('/editar/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) {
      res.render('usuarios/editar',{
        title: 'Editar Usuario',
        usuarios: result,
        usuario: req.user
      });
    }
  });
});
router.post('/editar/', function(req, res, next) {
  User.findById(req.body._id, function(err, result) {
    var query = { '_id':req.body._id };
    var datos = req.body;
    if(req.body.password){
      var salt = result.salt;
      var hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');
      datos["hash"] = hash;
    }
    User.findByIdAndUpdate( query,datos,{new: true},
      (err2, todo) => {
        if (err2) return res.status(500).send(err2);
        res.redirect('/usuarios/todos/');
      }
    )
  })
});
router.get('/eliminar/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/usuarios/todos/');
  });
});




router.get('/registro', function(req, res) {
	res.render('usuarios/nuevo.pug', { message: req.flash('loginMessage'), usuario: req.user}); // load the index.ejs file
});

router.post('/registro', function(req, res, next){
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.nombreCompleto = req.body.nombreCompleto;
  user.dni = req.body.dni;
  user.tipoUsuario = req.body.tipoUsuario;

  user.save().then(function(){
    return res.redirect('/home');
  }).catch(next);
});


//Configuring app to have sessions 
passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    if(err) return res.status(500).send(err);
    if(user) done(err, user);

  })
})


module.exports = router;