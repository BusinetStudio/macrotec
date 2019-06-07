const mysql = require('mysql');
const request = require('../config/connect');
const connection = mysql.createConnection(request.connection);
connection.query('USE ' + request.database);
const moment = require('moment');

var potencialesController = {
    nuevo:nuevo,
    todos:todos,
    editar:editar,
    getById:getById,
    borrar:borrar,
    actividades:actividades,
    actividadNueva:actividadNueva,
    actividadBorrar:actividadBorrar
}
function nuevo(req, res){
    var datos = [];
    var columnas = '';
    var valores = '';
    if(req.body.tipo == 'nuevo'){
        if(req.body.nombre_apellido) datos['nombre_apellido'] = '"'+req.body.nombre_apellido+'"';
        if(req.body.dni) datos['dni'] = '"'+req.body.dni+'"';
        if(req.body.telefono) datos['telefono'] = '"'+req.body.telefono+'"';
        if(req.body.celular) datos['celular'] = '"'+req.body.celular+'"';
        if(req.body.email) datos['email'] = '"'+req.body.email+'"';
    }else if(req.body.tipo == 'cliente'){
        if(req.body.id_potencial_cliente) datos['id_potencial_cliente'] = req.body.id_potencial_cliente;
    }
    if(req.body.vendedor_asignado) datos['vendedor_asignado'] = req.body.vendedor_asignado;
    if(req.body.curso_interes) datos['curso_interes'] = req.body.curso_interes;
    var i = 0;
    for(key in datos){
        columnas += key;
        valores += datos[key];
        if (i != Object.keys(datos).length - 1) {
            columnas += ', ';  
            valores += ', ';
        }
        i++;     
    }
    connection.query('INSERT INTO potenciales ('+columnas+') VALUES ('+ valores +');',
    function (err, rows) {
        if(err){
            console.log(err);
            res.redirect('/ventas/clientes-potenciales/nuevo');
        }
        if(rows){
            res.redirect('/ventas/clientes-potenciales/');
        }
    });

}
function editar(req, res){
    var datos = [], consulta = '';
    if(req.body.tipo == 'nuevo'){
        if(req.body.nombre_apellido) datos['nombre_apellido'] = '"'+req.body.nombre_apellido+'"';
        if(req.body.dni) datos['dni'] = '"'+req.body.dni+'"';
        if(req.body.telefono) datos['telefono'] = '"'+req.body.telefono+'"';
        if(req.body.celular) datos['celular'] = '"'+req.body.celular+'"';
        if(req.body.email) datos['email'] = '"'+req.body.email+'"';
    }else if(req.body.tipo == 'cliente'){
        if(req.body.id_potencial_cliente) datos['id_potencial_cliente'] = req.body.id_potencial_cliente;
    }
    if(req.body.curso_interes) datos['curso_interes'] = req.body.curso_interes;
    if(req.body.vendedor_asignado) datos['vendedor_asignado'] = +req.body.vendedor_asignado;
    var i = 0;
    for(key in datos){
        consulta += key + '=' + datos[key];
        if (i != Object.keys(datos).length - 1) {
            consulta += ', ';  
        }
        i++;     
    }
    connection.query('UPDATE potenciales SET '+consulta+' WHERE id_potencial = '+ req.body.id +';',
    function (err, rows) {
        if(err) {console.log(err); res.redirect('/ventas/reserva/todos')}; 
        if(rows) res.redirect('/ventas/reserva/todos');
    });

}
function getById(req, res){
    connection.query('SELECT * FROM potenciales WHERE id_potencial = "'+req+'";', function (err, rows) {
        if(err) throw err;
        else res(rows[0]);
    }
);
}
function todos(res){
    connection.query('SELECT * FROM potenciales;',
    function (err, rows) {
        if(err)res.redirect('/ventas/clientes-potenciales/');
        if(rows) res(rows);
    });
}
function borrar(req, res){
    const data = req.params;
    connection.query('DELETE FROM potenciales WHERE id_potencial = "'+ data.id +'";',
        function (err, rows) {
            res.redirect('/ventas/clientes-potenciales/');
        }
    );
}

function actividades(res){
    connection.query('SELECT * FROM actividades;',
    function (err, rows) {
        if(err)res.redirect('/ventas/clientes-potenciales/');
        if(rows) res(rows);
    });
}
function actividadNueva(req, res){
    var datos = [], columnas = '', valores = '';
    if(req.body.actividad) datos['actividad'] = '"'+req.body.actividad+'"';
    if(req.body.id) datos['potencial'] = req.body.id;
    datos['fecha_actividad'] = '"'+moment().add(1,'month').format("YYYY-MM-DD")+'"';
    var i = 0;
    for(key in datos){
        columnas += key;
        valores += datos[key];
        if (i != Object.keys(datos).length - 1) {
            columnas += ', ';  
            valores += ', ';
        }
        i++;     
    }
    connection.query('INSERT INTO actividades ('+columnas+') VALUES ('+ valores +');',
    function (err, rows) {
        if(err) res.redirect('/ventas/clientes-potenciales/');
        if(rows) res.redirect('/ventas/clientes-potenciales/');
    });
}
function actividadBorrar(req, res){
    const data = req.params;
    connection.query('DELETE FROM actividades WHERE id_actividad = "'+ data.id +'";',
        function (err, rows) {
            res.redirect('/ventas/clientes-potenciales/');
        }
    );
}
module.exports = potencialesController;