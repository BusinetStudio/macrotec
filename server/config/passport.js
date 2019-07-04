// config/passport.js

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');



passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}).then(function(user){
            if(!user || !user.validPassword(password)){
                return done(null, false, {error: 'Usuario o contraseña invalidos'});

            }
            return done(null, user);
        }).catch(done);
    }
));


