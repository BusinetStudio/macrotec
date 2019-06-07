module.exports = function(
    router, 
    loggedIn,
    softwareControllers, 
    cursosControllers, 
    usuariosControllers, 
    reservasControllers    
  ){
    router.post('/api/productos/nuevo', softwareControllers.nuevo);
    router.get('/api/productos/delete/:id', softwareControllers.eliminar);
    router.post('/api/productos/update', softwareControllers.editar);
}