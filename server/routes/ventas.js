

module.exports = function(
  router, 
  loggedIn,
  softwareControllers, 
  cursosControllers, 
  usuariosControllers, 
  reservasControllers,
  potencialesControllers
){
  //actividades
  router.get('/ventas/clientes-potenciales/actividad/borrar/:id',loggedIn, potencialesControllers.actividadBorrar);
  router.post('/ventas/clientes-potenciales/actividad/nuevo/',loggedIn, potencialesControllers.actividadNueva);

  //clientes potencial
  router.get('/ventas/clientes-potenciales/',loggedIn ,function(req, res, next){
    cursosControllers.todos(function(cursos){
      softwareControllers.todos(function(softwares){
        usuariosControllers.todos(function(vendedores){
          usuariosControllers.alumnos(function(alumnos){
            usuariosControllers.alumnosInfo(function(alumnosInfo){
              potencialesControllers.todos(function(potenciales){
                potencialesControllers.actividades(function(actividades){
                  res.render(
                    'ventas/potenciales', 
                    { 
                      title: 'Clientes Potenciales',
                      cursos: cursos,
                      softwares: softwares,
                      vendedores: vendedores,
                      alumnos: alumnos,
                      alumnosInfo:alumnosInfo,
                      potenciales: potenciales,
                      actividades:actividades,
                      user: req.user.id_u
                    }
                  );
                });
              });
            });
          });
        });
      });
    });
  });
  router.get('/ventas/clientes-potenciales/nuevo',loggedIn ,function(req, res, next){
    cursosControllers.todos(function(cursos){
      softwareControllers.todos(function(softwares){
        usuariosControllers.alumnos(function(alumnos){
          res.render(
            'ventas/nuevo_potencial', 
            { 
              title: 'Ventas',
              cursos: cursos,
              softwares: softwares,
              alumnos: alumnos,
              user: req.user.id_u
            }
          );
        });
      });
    })
  });
  router.get('/ventas/clientes-potenciales/borrar/:id',loggedIn, potencialesControllers.borrar);
  router.get('/ventas/clientes-potenciales/editar/:id',loggedIn, function(req, res){
    cursosControllers.todos(function(cursos){
      softwareControllers.todos(function(softwares){
        usuariosControllers.alumnos(function(alumnos){
          usuariosControllers.alumnosInfo(function(alumnosInfo){
          var idU = req.params.id;
            potencialesControllers.getById(idU, function(response){
              res.render(
                'ventas/editar_potencial', 
                {  
                  title: 'Clientes potenciales',
                  potencial: response,
                  softwares: softwares,
                  alumnos: alumnos,
                  cursos: cursos,
                  alumnosInfo:alumnosInfo
                }
              );
            })
          });
        });
      });
    });
  });

  router.post('/ventas/clientes-potenciales/nuevo',loggedIn, potencialesControllers.nuevo);
  router.post('/api/clientes-potenciales/editar',loggedIn, potencialesControllers.editar);

  //Reservas
  router.get('/ventas/reserva/nuevo',loggedIn ,function(req, res, next){
    cursosControllers.todos(function(cursos){
      softwareControllers.todos(function(softwares){
        usuariosControllers.alumnos(function(alumnos){
          res.render(
            'ventas/nueva_reserva', 
            { 
              title: 'Ventas',
              cursos: cursos,
              softwares: softwares,
              alumnos: alumnos,
              user: req.user.id_u
            }
          );
        });
      });
    })
  });
  router.post('/ventas/reserva/nuevo', reservasControllers.nuevo);
  router.get('/ventas/reserva/editar/:id', function(req, res){
    cursosControllers.todos(function(cursos){
      softwareControllers.todos(function(softwares){
        usuariosControllers.alumnos(function(alumnos){
          var idU = req.params.id;
          reservasControllers.getById(idU, function(response){
            console.log(response);
            res.render(
              'ventas/editar_reserva', 
              {  
                title: 'Ventas',
                ventas: response,
                softwares: softwares,
                alumnos: alumnos,
                cursos: cursos
              }
            );
          })
        });
      });
    });
  });
  router.get('/ventas/reserva/todos',loggedIn ,function(req, res, next){
    reservasControllers.todos(function(reservas){
      cursosControllers.todos(function(cursos){
        softwareControllers.todos(function(softwares){
          usuariosControllers.todos(function(vendedores){
            usuariosControllers.alumnos(function(alumnos){
              potencialesControllers.todos(function(potenciales){
                res.render(
                  'ventas/todos', 
                  { 
                    title: 'Ventas',
                    cursos: cursos,
                    softwares: softwares,
                    vendedores: vendedores,
                    alumnos: alumnos,
                    reservas: reservas,
                    user: req.user.id_u,
                    potenciales:potenciales
                  }
                );
              });
            });
          });
        });
      });
    });
  });
  router.get('/ventas/reserva/borrar/:id', reservasControllers.borrar);

 
}
