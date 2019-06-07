const mysql = require('mysql');
const request = require('../config/connect');
const connection = mysql.createConnection(request.connection);
connection.query('USE ' + request.database);
const moment = require('moment');

var reservasController = {
    nuevo:nuevo,
    todos:todos,
    editar:editar,
    getById:getById,
    borrar:borrar
}
function nuevo(req, res){
    var datos = [],columnas = '',valores = '';
    if(req.body.vendedor) datos['vendedor'] = req.body.vendedor;
    if(req.body.id_u) datos['id_u'] = req.body.id_u;
    if(req.body.id_potencial) datos['id_potencial'] = req.body.id_potencial;
    if(req.body.fecha_reserva) datos['fecha_reserva'] = '"'+req.body.fecha_reserva+'"';
    if(req.body.id_c) datos['id_c'] = req.body.id_c;
    if(req.body.comentarios) datos['comentarios'] = '"'+req.body.comentarios+'"';
    var fecha_ahora = '"'+moment().add(1,'month').format("YYYY-MM-DD")+'"';
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
    connection.query('INSERT INTO reservas ('+columnas+') VALUES ('+ valores +');',
    function (err, rows) {
        if(err){ console.log(err); res.redirect('/ventas/clientes-potenciales/');}
        if(rows){
            connection.query('INSERT INTO actividades (potencial, actividad, fecha_actividad) VALUES ('+ req.body.id_potencial +', "'+req.body.actividad+'",'+fecha_ahora+');',
            function (err, rows) {
                if(err) {console.log(err); res.redirect('/ventas/clientes-potenciales/')};
                if(rows) res.redirect('/ventas/reserva/todos');
            });
        } 
    });
}
function editar(req, res){
    var datos = [],columnas = '',valores = '';
    if(req.body.vendedor) datos['vendedor'] = req.body.vendedor;
    if(req.body.fecha_reserva) datos['fecha_reserva'] = '"'+req.body.fecha_reserva+'"';
    if(req.body.id_c) datos['id_c'] = req.body.id_c;
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
    connection.query('INSERT INTO reservas ('+columnas+') VALUES ('+ valores +');',
    function (err, rows) {
        if(err) res.redirect('/ventas/reserva/todos'); 
        if(rows) res.redirect('/ventas/reserva/todos');
    });

}
function getById(req, res){
    connection.query('SELECT * FROM reservas WHERE id_reserva = "'+req+'";', function (err, rows) {
        if(err) throw err;
        else res(rows[0]);
    }
);
}
function todos(res){
    connection.query('SELECT * FROM reservas;',
    function (err, rows) {
        if(err)res.redirect('/ventas/reserva/todos');
        if(rows) res(rows);
    });
}
function borrar(req, res){
    const data = req.params;
    connection.query('DELETE FROM reservas WHERE id_reserva = "'+ data.id +'";',
        function (err, rows) {
            res.redirect('/ventas/reserva/todos');
        }
    );
}
module.exports = reservasController;