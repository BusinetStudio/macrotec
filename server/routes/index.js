var express = require('express');
var router = express.Router();
var passport = require('passport')

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}
function loggedInHome(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    next();
  }
}
function isAdmin(req, res, next){
  if(req.user.tipoUsuario == 'Admin'){
    next();
  } else {
    res.redirect('/');
  }
}
/* GET home page. */
router.get('/',loggedInHome, function(req, res, next) {
  res.render('index', { title: 'Macrotec App', usuario: req.user});
});
router.get('/home',loggedIn, function(req, res, next) {
  res.render('dashboard/home', { title: 'Home', usuario: req.user });
});
router.post('/login', function(req, res, next){
  if(!req.body.username){
    return res.status(422).json({error: "Debe rellenar todos los campos"});
  }
  if(!req.body.password){
    return res.status(422).json({error: "Debe rellenar todos los campos"});
  }
  if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }
    if(user){
      user.token = user.generateJWT();
      req.login(user, function(error) {
        if (error) return next(error);
        return res.redirect('/home/');
      });
      return res.redirect('/home')
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});
router.get('/salir',loggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});



//Routes
router.use('/usuarios', isAdmin, require('./usuarios'));

router.use('/administracion', isAdmin, require('./administracion'));
router.use('/cuenta', loggedIn, require('./cuenta/'));
router.use('/ventas', loggedIn, require('./ventas/'));


module.exports = router;