module.exports = function(
    router, 
    loggedIn,
    softwareControllers, 
    cursosControllers, 
    usuariosControllers, 
    reservasControllers    
  ){
    router.post('/api/cursos/new', cursosControllers.nuevo);
    router.get('/api/cursos/delete/:id', cursosControllers.eliminar);
    router.post('/api/cursos/editar/:id', cursosControllers.editar);
}