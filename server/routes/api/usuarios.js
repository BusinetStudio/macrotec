module.exports = function(
    router, 
    loggedIn,
    softwareControllers, 
    cursosControllers, 
    usuariosControllers, 
    reservasControllers    
  ){

router.post('/api/usuarios/new', usuariosControllers.nuevo);
router.get('/api/usuarios/delete/:id', usuariosControllers.eliminar);
router.post('/api/usuarios/editar/:id', usuariosControllers.editar);
}
