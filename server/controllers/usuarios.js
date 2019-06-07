
const mysql = require('mysql');
const request = require('../config/connect');
const connection = mysql.createConnection(request.connection);
connection.query('USE ' + request.database);
var bcrypt = require('bcrypt-nodejs');


var usuariosController = {
    nuevo:nuevo,
    editar:editar,
    eliminar:eliminar,
    todos:todos,
    getById: getById,
    profesores: profesores,
    alumnos: alumnos,
    alumnosInfo:alumnosInfo
 }

function nuevo(req, res){
    var username = req.body.username;
    var dni = req.body.dni;
    var email = req.body.email;
    var displayName = req.body.displayName;
    var password = bcrypt.hashSync(req.body.password, null, null);
    var id_p = req.body.id_p;
    connection.query('SELECT name FROM privilege WHERE id_p = "'+id_p+'";', function(err, rows){
        var privilege = rows[0].name;
        
        connection.query('INSERT INTO users (username, email, dni, password, id_p, privilege, displayName) VALUES ("'+ username +'", "'+email+'", "'+dni+'", "'+password+'", "'+id_p+'","'+privilege+'","'+displayName+'");',
        function (err, rows2) {
            if(err){
                if(err.errno)
                    if(err.errno == 1062)
                        res.redirect('/usuarios/todos?resp=duplicado');
                res.redirect('/usuarios/todos');
            }
            if(rows2){
                res.redirect('/usuarios/todos');
            }
            
        });
    });
}
function editar(req, res){
    var editar = req.body
    var consulta = '';
    var consultaJson = [];
    consultaJson.push(
        'username = "'+editar.username+'"',
        'dni = "'+editar.dni+'"',
        'email = "'+editar.email+'"',
        'displayName = "'+editar.displayName+'"'
    );
    if(editar.password){
        var password = bcrypt.hashSync(req.body.password, null, null);
        consultaJson.push('password = "'+password+'"');
    }
     if(editar.id_p){
        connection.query('SELECT name FROM privilege WHERE id_p = "'+editar.id_p+'";',
            function (err, rows) {
                consultaJson.push(
                    'id_p ="'+editar.id_p+'"',
                    'privilege ="'+ rows[0].name+'"'
                );
                consultaJson.forEach(function(i, idx, array){
                    consulta += i;
                    if (idx != array.length - 1) consulta += ', '; 
                 });
                connection.query('UPDATE users SET '+ consulta +' WHERE id_u = "'+ editar.id_u +'";',
                    function (err, rows) {
                        if(err){
                            res.redirect('/usuarios/todos');
                        }
                        if(rows){
                            res.redirect('/usuarios/todos');
                        }
                    }
                );
            }
        );
    }else{
        consultaJson.forEach(function(i, idx, array){
            consulta += i;
            if (idx != array.length - 1) consulta += ', '; 
         });
        connection.query('UPDATE users SET '+ consulta +' WHERE id_u = "'+ editar.id_u +'";',
            function (err, rows) {
                if(err){
                    res.redirect('/usuarios/todos');
                }
                if(rows){
                    res.redirect('/usuarios/todos');
                }
            }
        );
    }
}
function getById(req, res){
    connection.query('SELECT id_u, password, username, email, dni, id_p, privilege, displayName FROM users WHERE id_u = "'+req+'";', function (err, rows) {
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
    connection.query('DELETE FROM users WHERE id_u = "'+ data.id +'";',
        function (err, rows) {
            res.redirect('/usuarios/todos');
        }
    );
}

function todos(callback){
    connection.query('SELECT * FROM users;', function (err, rows) {
            if(err)
			{
				throw err;
			}
			else
			{
                //devolvemos el id del usuario insertado
                //console.log(rows);
                callback(rows);
			}
        }
    );    
}
function profesores(callback){
    connection.query('SELECT * FROM users WHERE id_p = "3";', function (err, rows) {
            if(err) throw err;
			else{
                callback(rows);
			}
        }
    );    
}
function alumnos(callback){
    connection.query('SELECT * FROM users WHERE id_p = "4";', function (err, rows) {
            if(err){ console.log(err); throw err}
			else{
                callback(rows);
			}
        }
    );    
}
function alumnosInfo(callback){
    connection.query('SELECT * FROM users JOIN info_users ON (users.id_u = info_users.usuario_info_user) WHERE users.id_p = "4";', function (err, rows) {
            if(err){ console.log(err); throw err}
			else{
                callback(rows);
			}
        }
    );    
}


module.exports = usuariosController;