const mysql = require('mysql');
const request = require('../config/connect');
const connection = mysql.createConnection(request.connection);
connection.query('USE ' + request.database);
const fs = require('fs');
const formidable = require('formidable');
var path = require('path');

var reservasController = {
    nuevo:nuevo,
    todos:todos,
    editar:editar,
    getById:getById,
    borrar:borrar
}
function nuevo(req, res){
    var datos = [];
    var columnas = ''
    var valores = '';
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('field', function(name, field) {
        datos[name] = '"'+field+'"';
    }).on('file', function(name, file){
        var url =  req.protocol + '://' + req.get('host');
        var reserva = datos.reserva.replace(/"/g, ''),
            fecha = datos.fecha.replace(/"/g,''),
            extension = file.name.split('.').pop();
        datos[name] = '"'+url+'/archivos/'+reserva+'-'+fecha+'-'+name+'.'+extension+'"';
    }).on('fileBegin', function(name, file) {
        var reserva = datos.reserva.replace(/"/g, ''),
            fecha = datos.fecha.replace(/"/g,''),
            extension = file.name.split('.').pop();
        file.path = 'public/archivos/'+reserva+'-'+fecha+'-'+name+'.'+extension;
    }).on('end', function(){
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
        connection.query('INSERT INTO pagos ('+columnas+') VALUES ('+ valores +');',
        function (err, rows) {
            if(err){
                console.log(err);
                res.redirect('/ventas/pagos/nuevo');
            }
            if(rows){
                connection.query('UPDATE reservas SET cuotas_pagadas = cuotas_pagadas + 1, estado = "Matriculado" WHERE id_reserva = '+datos.reserva.replace(/"/g, '')+';',
                function (err, rows) {
                    if(err){
                        res.redirect('/ventas/pagos/nuevo');
                    }
                    if(rows){
                    
                        res.redirect('/ventas/pagos/todos');
                    }
                });
            }
        });
    });
}

function editar(req, res){
    var datos = [];
    var consulta = ''
    var form = new formidable.IncomingForm();
    var reserva = '', id_pago = '';
    form.parse(req);
    var ruta = path.join(__dirname,'..','..');
    form.uploadDir = ruta+'/public/archivos/';
    form.on('field', function(name, field) {
        if(name == 'id_pago') id_pago = field;
        else if(name=='id_reserva') reserva = field;
        else datos[name] = '"'+field+'"';
    }).on('file', function(name, file){
            var url =  req.protocol + '://' + req.get('host');
            var fecha = datos.fecha.replace(/"/g,'');
            var extension = file.name.split('.').pop();   
            fs.rename(file.path, form.uploadDir+reserva+'-'+fecha+'-'+name+'.'+extension,function(err){
                if (err) throw err;
            });
            datos[name] = '"'+url+'/archivos/'+reserva+'-'+fecha+'-'+name+'.'+extension+'"';
    }).on('end', function(){
        var i = 0;
        for(key in datos){
            consulta += key + '=' + datos[key];
            if (i != Object.keys(datos).length - 1) {
                consulta += ', '; 
            }
            i++;     
        }        
        connection.query('UPDATE pagos SET '+consulta+' WHERE id_pago = '+id_pago+';',
        function (err, rows) {
            if(err){
                res.redirect('/ventas/pagos/nuevo');
            }
            if(rows){
                res.redirect('/ventas/pagos/todos'); 
            }
        });
    });
    
}
function getById(req, res){
    connection.query('SELECT * FROM pagos WHERE id_pago = "'+req+'";', function (err, rows) {
        if(err) throw err;
        else res(rows[0]);
    }
);
}
function todos(res){
    connection.query('SELECT * FROM pagos;',
    function (err, rows) {
        if(err)res.redirect('/ventas/pagos/todos');
        if(rows) res(rows);
    });
}
function borrar(req, res){
    const data = req.params;
    connection.query('DELETE FROM pagos WHERE id_pago = "'+ data.id +'";',
        function (err, rows) {
            connection.query('UPDATE reservas SET cuotas_pagadas = cuotas_pagadas - 1 WHERE id_reserva = "'+ data.reserva +'";',
                function (err, rows) {
                    res.redirect('/ventas/pagos/todos');
                }
            );
        }
    );
}
module.exports = reservasController;