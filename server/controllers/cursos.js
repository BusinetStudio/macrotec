const mysql = require('mysql');
const request = require('../config/connect');
const connection = mysql.createConnection(request.connection);
connection.query('USE ' + request.database);

var cursosController = {

    nuevo:nuevo,
    editar:editar,
    eliminar:eliminar,
    todos:todos,
    getById: getById

}
 
function nuevo(req, res){
    var datos = [];
    var columnas = '';
    var valores = '';
    if(req.body.id_s) datos['id_s'] = req.body.id_s;
    if(req.body.sede) datos['sede'] = '"'+req.body.sede+'"';
    if(req.body.modalidad) datos['modalidad'] = '"'+req.body.modalidad+'"';
    if(req.body.aula) datos['aula'] = req.body.aula;
    if(req.body.cupos) datos['cupos'] = req.body.cupos;
    if(req.body.clases) datos['clases'] = req.body.clases;
    if(req.body.profesor) datos['profesor'] = req.body.profesor;
    if(req.body.fecha_inicio) datos['fecha_inicio'] = '"'+req.body.fecha_inicio+'"';
    if(req.body.fecha_fin) datos['fecha_fin'] = '"'+req.body.fecha_fin+'"';
    if(req.body.hora_inicio) datos['hora_inicio'] = '"'+req.body.hora_inicio+'"';
    if(req.body.hora_fin) datos['hora_fin'] = '"'+req.body.hora_fin+'"';
    if(req.body.precio) datos['precio'] = '"'+req.body.precio+'"';
    if(req.body.cuotas) datos['cuotas'] = '"'+req.body.cuotas+'"';
    
    if(req.body.dias){
        var dias = req.body.dias;
        var string = '';
        var i = 0;
        if (typeof dias === "string"){
            datos['dias'] = '"'+dias+'"';
        }else{
            for(key in dias){
                string += dias[key];
                if (i != Object.keys(dias).length - 1) {
                    string += ' ';  
                }
                i++;     
            }
            datos['dias'] = '"'+string+'"';
        }
    }
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
    connection.query('INSERT INTO curso ('+columnas+') VALUES ('+ valores +');',
    function (err, rows) {
        if(err){
            if(err.errno)
                if(err.errno == 1062)
                    res.redirect('/administracion/cursos?resp=duplicado');
            res.redirect('/administracion/cursos');
        }
        if(rows){
            connection.query('SELECT codigo FROM software WHERE id_s="'+datos['id_s']+'";',
            function (err2, rows2) {
                if(rows2){
                    connection.query('UPDATE curso SET codigo="'+rows2[0].codigo+'-'+rows.insertId+'" WHERE id_c="'+rows.insertId+'";',
                    function (err3, rows3) {
                        if(rows3){
                            res.redirect('/administracion/cursos');
                        }
                    });
                }
                
            });
            
        }
    });
    
}

function editar(req, res){
    var editar = req.body
    var consulta = '';
    var consultaJson = [];
    consultaJson.push(
        'id_s = '+editar.id_s,
        'sede = "'+editar.sede+'"',
        'modalidad = "'+editar.modalidad+'"',
        'aula = '+editar.aula,
        'cupos = '+editar.cupos,
        'clases = '+editar.clases,
        'profesor = '+editar.profesor,
        'fecha_inicio = "'+editar.fecha_inicio+'"',
        'fecha_fin = "'+editar.fecha_fin+'"',
        'hora_inicio = "'+editar.hora_fin+'"',
        'hora_fin = "'+editar.hora_fin+'"',
        'precio = '+editar.precio+'',
        'cuotas = '+editar.cuotas+'',
    );
    if(editar.dias){
        var dias = editar.dias;
        var string = '';
        var i = 0;
        if (typeof dias === "string"){
            consultaJson.push('dias ="'+dias+'"');
        }else{
            for(key in dias){
                string += dias[key];
                if (i != Object.keys(dias).length - 1) {
                    string += ' ';  
                }
                i++;     
            }
            consultaJson.push('dias ="'+string+'"');
        }
    }else{
        consultaJson.push('dias ="'+editar.dias_antiguos+'"');
    }
    consultaJson.forEach(function(i, idx, array){
        consulta += i;
        if (idx != array.length - 1) consulta += ', '; 
     });
     
    console.log(consulta);
    connection.query('UPDATE curso SET '+consulta+' WHERE id_c = "'+ editar.id_c +'";',
        function (err, rows) {
            res.redirect('/administracion/cursos');
        }
    );

}
function getById(req, res){
    connection.query('SELECT * FROM curso WHERE id_c = "'+req.params.id+'";', function (err, rows) {
            if(err)
			{
				throw err;
			}
			else
			{
                //devolvemos el id del usuario insertado
                //console.log(rows);
                res(rows[0]);
			}
        }
    );    
}
function eliminar(req, res){
    const data = req.params;
    connection.query('DELETE FROM curso WHERE id_c = "'+ data.id +'";',
        function (err, rows) {
            res.redirect('/administracion/cursos');
        }
    );
    //res.redirect('/administracion/cursos');

}

function todos(callback){

    connection.query('SELECT * FROM curso;',
        function (err, rows) {
            if(err)
			{
				throw err;
			}
			else
			{
				//devolvemos el id del usuario insertado
				callback(rows);
			}
        }
    );

}

module.exports = cursosController;