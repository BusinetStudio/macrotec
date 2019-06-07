var mongoose = require('mongoose');
var router = require('express').Router();
var Productos = mongoose.model('Productos');
var Cursos = mongoose.model('Cursos');
var Usuarios = mongoose.model('Usuarios');

router.get('/productos/', function(req, res, next) {
  Productos.find(function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) {
      res.render(
        'administracion/softwares-autodesk', 
        { 
          title: 'Productos', 
          softwares: result,
          usuario: req.user
        }
      );
    }
  });
});
router.post('/productos/nuevo', function(req, res, next) {
  var producto = new Productos();
  producto.nombre = req.body.nombre;
  producto.codigo = req.body.codigo;
  producto.save().then(function(){
    return res.redirect('/administracion/productos/')
  }).catch(next);
});

router.post('/productos/editar/', function(req, res, next) {
  var query = { '_id':req.body.id };
  Productos.findByIdAndUpdate( query,req.body,{new: true},
    (err, todo) => {
      if (err) return res.status(500).send(err);
      res.redirect('/administracion/productos/');
    }
  )
});

router.get('/productos/eliminar/:id', function(req, res, next) {
  Productos.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/administracion/productos/');
  });
});


router.get('/cursos/', function(req, res, next) {
  var datos = {title: 'Cursos'}
  Productos.find({},'nombre',function(err, result) {
    if(err) return res.status(500).send(err);
    datos['productos'] = result;
    
  }).then((r)=>{
    Usuarios.find({tipoUsuario: 'Profesor'},function(err2, result2) {
      datos['profesores'] = result2;
      datos['usuario'] = req.user;
      Cursos.find((err, result) =>{
        datos['cursos'] = result;
        res.render('administracion/cursos',datos);
      });
    });
  });
});

router.get('/cursos/nuevo', function(req, res, next) {
  Productos.find(function(err, result) {
    Usuarios.find({tipoUsuario: 'Profesor'},function(err2, result2) {
      res.render('administracion/cursos-nuevo',{
        title: 'Nuevo Curso',
        productos: result,
        profesores: result2,
        usuario: req.user
      });
    });
  });
});

router.post('/cursos/nuevo', async function(req, res, next) {
  var curso = new Cursos();
  for(key in req.body){
    curso[key] = req.body[key];
  }
  nombreSoftware = await Productos.findById(req.body.software);
  curso["softwareName"] = nombreSoftware.nombre;
  curso.save().then(function(){
    return res.redirect('/administracion/cursos/')
  }).catch(next);
});

router.get('/cursos/eliminar/:id', function(req, res, next) {
  Cursos.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/administracion/cursos/');
  });
});

router.get('/cursos/editar/:id', function(req, res, next) {
  Cursos.findById(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) {
      Usuarios.find({tipoUsuario: 'Profesor'},function(err2, result2) {
        if(err2) return res.status(500).send(err2);
        if(result2) {
          Productos.find(function(err3, result3) {
            if(err3) return res.status(500).send(err3);
            if(result3) {
              res.render('administracion/cursos-editar',{
                title: 'Editar Curso',
                datos: result,
                profesores: result2,
                productos: result3
              });
            }
          });
        }
      });
    }
  });
});
router.post('/cursos/editar/', function(req, res, next) {
  var query = { '_id':req.body._id };
  Cursos.findByIdAndUpdate( query,req.body,{new: true},
    (err, todo) => {
      if (err) return res.status(500).send(err);
      res.redirect('/administracion/cursos/');
    }
  )
});

module.exports = router;