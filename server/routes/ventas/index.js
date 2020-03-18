var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var crypto = require('crypto');
var formidable = require('formidable');
const moment = require('moment')

var Productos = mongoose.model('Productos');
var Cursos = mongoose.model('Cursos');
var Usuarios = mongoose.model('Usuarios');
var Clientes = mongoose.model('Clientes');
var Reservas = mongoose.model('Reservas');
var Pagos = mongoose.model('Pagos');
var Actividades = mongoose.model('Actividades');
var Tareas = mongoose.model('Tareas');
var Cuentas = mongoose.model('Cuentas');

var peruGeo = {
  provincias: require('../../datos/peruGeo/provincias.json'),
  departamentos: require('../../datos/peruGeo/departamentos.json'),
  distritos: require('../../datos/peruGeo/distritos.json')
}
  
router.get('/clientes-potenciales', async function(req, res, next){
  var vendedores = await Usuarios.find({ tipoUsuario: {$in: ['Admin', 'Vendedor']} });
  var productos = await Productos.find();
  var cursos = await Cursos.find({fecha_fin: {$gte: new Date(moment())}});
  var potenciales = await Clientes.find();
  var data = {
    title: 'Clientes Potenciales',
    usuario: req.user,
    vendedores, vendedores,
    productos: productos,
    cursos: cursos,
    potenciales: potenciales,
    
  }
  res.render('ventas/potenciales',data)
});


router.get('/clientes-potenciales/nuevo', async function(req, res, next){
  var productos = await Productos.find();
  var cursos = await Cursos.find({fecha_fin: {$gte: new Date(moment())}});
  var cuentas = await Cuentas.find();
  var data = {
    title: 'Agregar Cliente Potencial',
    usuario: req.user,
    productos: productos,
    cursos: cursos,
    cuentas: cuentas,
  }
  res.render('ventas/nuevo_potencial',data)
});

router.post('/clientes-potenciales/nuevo', async function(req, res, next){
  var potencial = new Clientes();
  potencial.nombreCompleto = req.body.nombreCompleto;
  potencial.dni = req.body.dni;
  potencial.telefono = req.body.telefono;
  potencial.celular = req.body.celular;
  potencial.email = req.body.email;
  if(req.body.cursoId){
    potencial['cursoInteres'] = [];
    potencial['cursoInteresCodigo'] = [];
    if(Array.isArray(req.body.cursoId)){
      for(k in req.body.cursoId){
        var busqueda = await Cursos.findById(req.body.cursoId[k]);
        potencial['cursoInteres'].push(busqueda.softwareName);
        potencial['cursoInteresCodigo'].push(busqueda.codigo);        
      }
    }else{
      var busqueda = await Cursos.findById(req.body.cursoId);
      potencial['cursoInteres'].push(busqueda.softwareName);
      potencial['cursoInteresCodigo'].push(busqueda.codigo); 
    }
  }  
  potencial.vendedorAsignado = req.body.vendedorAsignado;
  potencial.vendedorAsignadoNombre = req.body.vendedorAsignadoNombre;
  potencial.cuenta = req.body.cuenta
  potencial.save().then(function(){
    return res.redirect('/ventas/clientes-potenciales');
  }).catch(next);
});
router.post('/clientes-potenciales/getByDni', async function(req, res, next){
  var potencial = await Clientes.find({dni: {$in: req.body.dni}});
  res.json(potencial)
});
router.get('/clientes-potenciales/editar/:id', async function(req, res, next){
  var vendedores = await Usuarios.find({ privilege: 'Vendedor', privilege: 'Admin'});
  var productos = await Productos.find();
  var cursos = await Cursos.find();
  var potencial = await Clientes.findById(req.params.id);
  var cuentas = await Cuentas.find();
  var data = {
    title: 'Editar Cliente Potencial',
    usuario: req.user,
    vendedores: vendedores,
    productos: productos,
    potencial: potencial,
    cursos: cursos,
    cuentas: cuentas,
  }
  
  res.render('ventas/editar_potencial',data)
});
router.post('/clientes-potenciales/editar', async function(req, res, next){
  var query = { '_id':req.body._id };
  var data= new Object;
  for(key in req.body){
    if(req.body.cursoId){
      data['cursoInteres'] = [];
      data['cursoInteresCodigo'] = [];
      for(k in req.body.cursoId){
        var busqueda = await Cursos.findById(req.body.cursoId[k]);
        data['cursoInteres'].push(busqueda.softwareName);
        data['cursoInteresCodigo'].push(busqueda.codigo);        
      }
      
    }else{
      data[key] = req.body[key];
    }
  }
  Clientes.findByIdAndUpdate( query,data,{new: true},
    (err, todo) => {
      if (err) return res.status(500).send(err);
      res.redirect('/ventas/clientes-potenciales/');
    }
  )
});

router.get('/clientes-potenciales/borrar/:id', function(req, res, next){
  Clientes.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/ventas/clientes-potenciales/');
  });
});


router.get('/reservas', async function(req, res, next){
  var cursos = await Cursos.find({fecha_fin: {$gte: new Date(moment())}});
  var data = { 
    title: 'Reservas',
    usuario: req.user,
    cursos: cursos,
    
  }
  res.render('ventas/reservas',data)
});
router.get('/reservas/:codigo', async function(req, res, next){
  var reservas = await Reservas.find({ cursoCodigo: {$in: req.params.codigo}, estado: 'Matriculado' });
  var pendientes = await Reservas.find({ cursoCodigo: {$in: req.params.codigo}, estado: 'Pendiente' });
  var curso = await Cursos.find({codigo: {$in: req.params.codigo}});
  
  var data = {
    title: 'Reservas',
    usuario: req.user,
    reservas: reservas,
    pendientes: pendientes,
    curso: curso[0]
  }
  res.render('ventas/reservas/reservas',data)
});
router.get('/reserva/nuevo/:codigo', async function(req, res, next){
  var cursos = await Cursos.find({fecha_fin: {$gte: new Date(moment())}});
  var potencial = await Clientes.findOne({dni: req.params.codigo});
  var data = {
    title: 'Reservas',
    usuario: req.user,
    cursos: cursos,
    potencial: potencial
  }
  res.render('ventas/reservas/nuevo',data)
});

router.post('/reserva/nuevo/', async function(req, res, next){
  cursoDatos = await Cursos.findById(req.body.curso);
  var reserva = new Reservas();
  reserva.vendedor = req.body.vendedor;
  reserva.vendedorNombre = req.body.vendedorNombre;
  reserva.potencial = req.body.potencial;
  potencialDatos = await Clientes.findById(req.body.potencial);
  reserva.potencialNombre = potencialDatos.nombreCompleto;
  reserva.dni = potencialDatos.dni;
  reserva.telefono = potencialDatos.telefono;
  reserva.celular = potencialDatos.celular;
  reserva.email = potencialDatos.email;
  reserva.fechaReserva = req.body.fechaReserva;
  reserva.curso = req.body.curso;
  reserva.cursoCodigo = cursoDatos.codigo;
  reserva.cursoNombre = cursoDatos.softwareName;
  reserva.comentarios = req.body.comentarios;
  var data = new Actividades();
  data.potencial = req.body.potencial;
  data.actividad = 'Reservo curso: '+cursoDatos.codigo+' - '+cursoDatos.softwareName;
  data.usuario_id = req.user._id;
  data.usuario_nombre = req.user.nombreCompleto;
  var today = new Date();
  var dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  var today = dd + '/' + mm + '/' + yyyy;
  data.fecha = today;
  var time = new Date();
  var horaActual = time.getHours() + ":" + time.getMinutes();
  data.hora = horaActual;
  Cursos.findByIdAndUpdate( { '_id':req.body.curso },{ $inc: { reservas: 1 } },{new: true},
    (err, todo) => {
      if (err) return res.status(500).send(err);
      data.save().then(function(){    
        reserva.save().then(function(){
          Clientes.findOne({_id: reserva.potencial}, function(err, cliente){
            cliente.cliente = true;
            cliente.save().then(function(){
              return res.redirect('/ventas/reservas/');
            })
          })
        }).catch(next);
      }).catch(next);
    }
  )
  
});

router.get('/reserva/editar/:id', async function(req, res, next){
  var reservas = await Reservas.findById(req.params.id);
  var potenciales = await Clientes.find();
  var pagos = await Pagos.find({reserva:reservas._id, dni:reservas.dni});
  
  console.log(reservas.cursoCodigo);
  
  var cursos = await Cursos.findOne({codigo: reservas.cursoCodigo});
  console.log(cursos);
  var data = {
    title: 'Reservas',
    usuario: req.user,
    reserva: reservas,
    pago: pagos,
    curso: cursos,
    potenciales: potenciales
  }
  res.render('ventas/reservas/editar',data)
});

router.post('/reserva/editar/:id', function(req, res, next){
  var query = { '_id':req.params.id };
  var data= new Object;
  for(key in req.body){
    data[key] = req.body[key];
  }
  Reservas.findByIdAndUpdate( query,data,{new: true},
    (err, todo) => {
      if (err) return res.status(500).send(err);
      res.redirect('/ventas/reservas/'+req.body.cursoCodigo);
    }
  )
  res.redirect('/ventas/reservas/'+req.body.cursoCodigo);
});

router.get('/reserva/borrar/:codigo/:id', async function(req, res, next){
  Reservas.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/ventas/reservas/'+req.params.codigo);
  });
});



router.get('/pagos/', async function(req, res, next){
  var clientes = await Clientes.find({cliente: true});
  var data = {
    title: 'Pagos',
    usuario: req.user,
    clientes: clientes,
  }
  res.render('ventas/pagos/',data)
});
router.get('/pagos/:dni', async function(req, res, next){
  var pagos = await Pagos.find({dni: req.params.dni});
  var data = {
    title: 'Pagos',
    usuario: req.user,
    pagos: pagos,
  }
  res.render('ventas/pagos/list',data)
});
router.get('/pagos/nuevo/:id/:dni', async function(req, res, next){
  console.log(req.params.id);
  //var cliente = await Clientes.findById(req.params.id);
  //console.log(cliente);
  var reserva = await Reservas.findOne({_id:req.params.id, estado:"Pendiente"});
  var user = await Usuarios.findOne({dni:req.params.dni});
  //var pagos = await reservas.find();
  var data = {
    title: 'Pagos',
    usuario: user,
    reserva: reserva,
  }
  res.render('ventas/pagos/nuevo',data)
});
router.post('/pagos/nuevo/', async function(req, res, next){
  var datos = [];
  console.log("----------------------------------------------------------");
  //console.log(req);
  console.log("----------------------------------------------------------");
  var form = new formidable.IncomingForm();
  form.parse(req);
  form.on('field', function(name, field) {
      datos[name] = field;
  }).on('file', function(name, file){
      var url =  req.protocol + '://' + req.get('host');
      var reserva = datos.reserva.replace(/"/g, ''),
          fecha = datos.fecha.replace(/"/g,''),
          extension = file.name.split('.').pop();
      datos[name] = url+'/archivos/'+reserva+'-'+fecha+'-'+name+'.'+extension;
  }).on('fileBegin', function(name, file) {
      var reserva = datos.reserva.replace(/"/g, ''),
          fecha = datos.fecha.replace(/"/g,''),
          extension = file.name.split('.').pop();
      file.path = 'public/archivos/'+reserva+'-'+fecha+'-'+name+'.'+extension;
  }).on('end', function(){
    var query = { '_id':  datos.reserva};
    Reservas.findOne(query,
    (err, reserva) => {
      if (err) return res.status(500).send(err);
      var pago = new Pagos();
      for(key in datos){
        pago[key] = datos[key];
      }
      reserva.montoPagado = reserva.montoPagado + datos.monto;
      reserva.save().then(function(){
        pago.cursoNombre = reserva.cursoNombre;
        pago.save().then(function(){
          return res.redirect('/ventas/reserva/editar/'+reserva._id);
        }).catch(next);
      }).catch(next);
      
    }
  )
    
  });
  return res.redirect('/ventas/reserva/editar/'+reserva._id);
});

router.get('/pagos/editar/:id', async function(req, res, next){
  var pago = await Pagos.findOne({_id: req.params.id});
  var data = {
    title: 'Pagos',
    usuario: req.user,
    pago: pago,
  }
  res.render('/pagos/editar',data)
});
router.post('/pagos/editar/:id', async function(req, res, next){
  var datos = [];
  console.log("-------------------------------------------------------------------");
  console.log(req.body);
  console.log("-------------------------------------------------------------------");
  var form = new formidable.IncomingForm();
  form.parse(req);
  form.on('field', function(name, field) {
      datos[name] = field;
  }).on('file', function(name, file){
      var url =  req.protocol + '://' + req.get('host');
      var reserva = datos.reserva.replace(/"/g, ''),
          fecha = datos.fecha.replace(/"/g,''),
          extension = file.name.split('.').pop();
      datos[name] = url+'/archivos/'+reserva+'-'+fecha+'-'+name+'.'+extension;
  }).on('fileBegin', function(name, file) {
      var reserva = datos.reserva.replace(/"/g, ''),
          fecha = datos.fecha.replace(/"/g,''),
          extension = file.name.split('.').pop();
      file.path = 'public/archivos/'+reserva+'-'+fecha+'-'+name+'.'+extension;
  }).on('end', function(){
    console.log(datos);
    var query = { '_id':  datos.reserva};
    var data= new Object;
    data['montoPagado'] = datos.monto;
    console.log("-------------------------------------------------------------------");
    console.log(query);
    console.log(data);
    console.log("-------------------------------------------------------------------");
    Reservas.findByIdAndUpdate(query,data,{new: true},
    (err, todo) => {
      if (err) return res.status(500).send(err);
      var data= new Object;
      for(key in datos){
        data[key] = datos[key];
      }
      Pagos.findByIdAndUpdate({'_id': req.params.id},data,{new: true},
      (err, todo) => {
        if (err) return res.status(500).send(err);
        res.redirect('/ventas/pagos/');
      }).catch(next);
    })
  });
  res.redirect('/ventas/pagos/');
});
router.get('/pagos/borrar/:reserva/:id', async function(req, res, next){
  var pago = await Pagos.findById(req.params.id);
  await Reservas.findByIdAndUpdate({'_id': req.params.reserva},{ $inc: {montoPagado: -pago.monto}},{new:true})
  
  Pagos.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/ventas/pagos/');
  });
});





router.get('/cuentas/', async function(req, res, next){
  var cuentas = await Cuentas.find();
  var data = {
    title: 'Cuentas',
    usuario: req.user,
    cuentas: cuentas
  }
  res.render('ventas/cuentas',data)
});
router.get('/cuentas/nuevo', async function(req, res, next){
  var data = {
    title: 'Cuentas',
    usuario: req.user,
    peruGeo: peruGeo
  }
  res.render('ventas/cuentas/nuevo',data)
});
router.get('/cuentas/borrar/:id', async function(req, res, next){
  Cuentas.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/ventas/cuentas/');
  });
});
router.get('/cuentas/editar/:id', async function(req, res, next){
  var cuenta = await Cuentas.findById(req.params.id);
  var data = {
    title: 'Cuentas',
    usuario: req.user,
    cuenta: cuenta,
    peruGeo: peruGeo
  }
  res.render('ventas/cuentas/editar',data)
});

router.post('/cuentas/nuevo/', async function(req, res, next){
  var cuentas = new Cuentas();
  for(key in req.body){
    cuentas[key] = req.body[key];
  }
  cuentas.save().then(function(){
    return res.redirect('/ventas/cuentas/');
  }).catch(next);
});
router.post('/cuentas/editar/:id', async function(req, res, next){
  var query = { '_id':req.params.id };
  var data= new Object;
  for(key in req.body){
    data[key] = req.body[key];
  }
  Cuentas.findByIdAndUpdate( query,data,{new: true},
    (err, todo) => {
      if (err) return res.status(500).send(err);
      res.redirect('/ventas/cuentas/');
    }
  )
});




router.get('/actividades/:id', async function(req, res, next){
  var actividades = await Actividades.find({potencial: req.params.id});
  var tareas = await Tareas.find({potencial: req.params.id, usuario_id: req.user._id});
  var potencial = await Clientes.findById(req.params.id);
  var data = {
    title: 'Actividades',
    usuario: req.user,
    actividades: actividades,
    potencial: potencial,
    tareas: tareas
  }
  res.render('ventas/actividades',data)
});

router.post('/actividades/nuevo/', async function(req, res, next){
  var data = new Actividades();
  for(key in req.body){
    data[key] = req.body[key];
  }
  var today = new Date();
  var dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  var today = dd + '/' + mm + '/' + yyyy;
  data.fecha = today;
  var time = new Date();
  var horaActual = time.getHours() + ":" + time.getMinutes();
  data.hora = horaActual;
  data.save().then(function(){
    return res.redirect('/ventas/actividades/'+req.body.potencial);
  }).catch(next);
});

router.get('/actividades/:potencial/borrar/:id', async function(req, res, next){
  Actividades.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/ventas/actividades/'+req.params.potencial);
  });
});


router.post('/tareas/nuevo/', async function(req, res, next){
  var data = new Tareas();
  for(key in req.body){
    data[key] = req.body[key];
  }
  var today = new Date();
  var dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  var today = dd + '/' + mm + '/' + yyyy;
  data.fecha = today;
  var time = new Date();
  var horaActual = time.getHours() + ":" + time.getMinutes();
  data.hora = horaActual;
  data.estado = 'Pendiente';
  data.save().then(function(){ 
    return res.redirect('/ventas/actividades/'+req.body.potencial);
  }).catch(next);
});
router.post('/tareas/estado/', async function(req, res, next){
  var query = { '_id':req.body.id };
  var data= new Object;
  data.estado = req.body.estado;
  Tareas.findByIdAndUpdate( query,data,{new: true},
    (err, todo) => {
      if (err) return res.status(500).send(err);
      res.json({message: 'actualizado'});
    }
  )
});



router.get('/tareas/:potencial/borrar/:id', async function(req, res, next){
  Tareas.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) return res.status(500).send(err);
    if(result) res.redirect('/ventas/actividades/'+req.params.potencial);
  });
});


module.exports = router;