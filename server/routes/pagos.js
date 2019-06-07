module.exports = function(
    router, 
    loggedIn,
    usuariosControllers,
    pagosControllers,
    reservasControllers,
    potencialesControllers   
  ){
    router.get('/ventas/pagos/nuevo',loggedIn ,function(req, res, next){
        usuariosControllers.alumnos(function(alumnos){
            pagosControllers.todos(function(pagos){
              reservasControllers.todos(function(reservas){
                potencialesControllers.todos(function(potenciales){
                  res.render(
                  'ventas/nuevo_pago', 
                  { 
                      title: 'Pagos',
                      alumnos: alumnos,
                      pagos: pagos,
                      reservas: reservas,
                      potenciales:potenciales,
                      user: req.user.id_u
                  }
                  );
                });
              });
            });
        });
    });

  router.post('/ventas/pagos/nuevo', loggedIn, pagosControllers.nuevo);
  router.post('/ventas/pagos/editar', loggedIn, pagosControllers.editar);
  
  router.get('/ventas/pagos/editar/:id',loggedIn,  function(req, res){
    usuariosControllers.alumnos(function(alumnos){
      var idU = req.params.id;
      pagosControllers.getById(idU, function(pago){
        reservasControllers.todos(function(reservas){
          potencialesControllers.todos(function(potenciales){
            res.render(
              'ventas/editar_pago', 
              {  
                title: 'Pagos',
                pago: pago,
                reservas: reservas,
                potenciales: potenciales,
                alumnos: alumnos,
              }
            );
          })
        })
      })
    });
  });
  
  

  router.get('/ventas/pagos/todos',loggedIn ,function(req, res, next){
      usuariosControllers.alumnos(function(alumnos){
        potencialesControllers.todos(function(potenciales){
          reservasControllers.todos(function(reservas){
            pagosControllers.todos(function(pagos){
                res.render(
                'ventas/pagos', 
                { 
                    title: 'Pagos',
                    reservas:reservas,
                    potenciales:potenciales,
                    alumnos: alumnos,
                    pagos:pagos,
                    user: req.user.id_u
                }
                );
            });
          });
        });
      });
  });

  
  router.get('/ventas/pagos/borrar/:id/:reserva', pagosControllers.borrar);

 
}
