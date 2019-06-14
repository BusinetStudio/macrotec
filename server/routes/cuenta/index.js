var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('Usuarios');

var Productos = mongoose.model('Productos');

var peruGeo = {
  provincias: require('../../datos/peruGeo/provincias.json'),
  departamentos: require('../../datos/peruGeo/departamentos.json'),
  distritos: require('../../datos/peruGeo/distritos.json')
}


router.get('/perfil', async function(req, res, next){
  var productos = await Productos.find();
  return res.render('cuenta/perfil',{
    title: 'Perfil',
    usuario: req.user,
    peruGeo: peruGeo,
    productos: productos
  });
});

router.post('/perfil', function(req, res, next){
  var query = { '_id':req.user._id };
  if(
    !(req.body.nombreCompleto
    && req.body.dni
    && req.body.email
    && req.body.fechaNacimiento
    && req.body.genero
    && req.body.direccion
    && req.body.departamento
    && req.body.provincia
    && req.body.distrito
    && req.body.telefono
    && req.body.celular)
  ){
    return res.status(422).json({error: "Debe rellenar todos los campos"});
  }else if (req.user.tipoUsuario == 'Alumno'){
    if(
        !(req.body.comoSeEntero
        && req.body.porQueMacrotec
        && req.body.cursoInteres
        && req.body.bolsaTrabajo)
      ){
        return res.status(422).json({error: "Debe rellenar todos los campos"});
      }
  }
  console.log(req.body)

  User.findByIdAndUpdate( query,req.body,{new: true},
    (err2, todo) => {
      if (err2) return res.status(500).send(err2);
      return res.json({redirect: "/home"});
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