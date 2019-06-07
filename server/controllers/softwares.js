
const mysql = require('mysql');
const request = require('../config/connect');
const connection = mysql.createConnection(request.connection);
connection.query('USE ' + request.database);
var sofwareController = {
    nuevo:nuevo,
    editar:editar,
    eliminar:eliminar,
    todos:todos,
 }
function nuevo(req, res){
    var name = req.body.nombre_sofware;
    var codigo = req.body.codigo;
    connection.query('INSERT INTO software (name, codigo) VALUES ("'+ name +'", "'+codigo+'");',
        function (err, rows) {
            if(err){
                console.log(err);
                if(err.errno)
                    if(err.errno == 1062)
                        res.redirect('/administracion/productos?resp=duplicado');
            }
            if(rows){
                res.redirect('/administracion/productos');
            }
            
        }
    );
    
}

function editar(req, res){
        var consulta = '';
        if(req.body.nombre_sofware)
            consulta += 'name = "'+req.body.nombre_sofware+'" ';
        if(req.body.codigo){
            if(req.body.nombre_sofware) consulta += ', ';
            consulta += 'codigo = "'+req.body.codigo+'" ';
        }

        var oldData = req.body.id;
        connection.query('UPDATE software SET '+ consulta +' WHERE id_s = "'+ oldData +'";',
            function (err, rows) {
                if(err){
                    res.redirect('/administracion/productos');
                }
                if(rows){
                    res.redirect('/administracion/productos');
                }
            }
        );
    }

function eliminar(req, res){
        const data = req.params;
        connection.query('DELETE FROM software WHERE id_s = "'+ data.id +'";',
            function (err, rows) {
                
                res.redirect('/administracion/productos');
            }
        );
    }

function todos(callback){
    connection.query('SELECT * FROM software;', function (err, rows) {
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

module.exports = sofwareController;