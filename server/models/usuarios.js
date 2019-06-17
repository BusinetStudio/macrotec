var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true, required: [true, "Debe rellenar todos los campos obligatorios"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "Debe rellenar todos los campos obligatorios"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  nombreCompleto: {type: String, required: [true, "Debe rellenar todos los campos obligatorios"]},
  dni: {type: String, required: [true, "Debe rellenar todos los campos obligatorios"]},
  tipoUsuario: {
    type: String, 
    enum: ["Admin", "Vendedor", "Profesor", "Alumno"],
    required: [true, "Debe rellenar todos los campos obligatorios"]
  },
  image: {type: String, default: '/assets/images/avatars/smiley-cyrus.jpg'},
  hash: String,
  salt: String,

  //Personal
  fechaNacimiento: String,
  genero: {type: String, enum:['Masculino', 'Femenino']},
  direccion: String,
  departamento: String,
  provincia: String,
  distrito: String,
  telefono: String,
  celular: String,

  //alumno
  instituto: String,
  carrera: String,
  empresaLabora:String,
  rucEmpresa:String,
  direccionEmpresa: String,
  distritoEmpresa: String,
  cargoEmpresa:String,
  emailEmpresa:String,
  telefonoEmpresa:String,
  
  //marketing
  comoSeEntero: String,
  porQueMacrotec: String,
  cursoInteres: [],
  bolsaTrabajo: String,
  ingles:String
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {error: 'is already taken.'});

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    image: this.image
  };
};

UserSchema.methods.toProfileJSONFor = function(user){
  return {
    username: this.username,
    _id: this._id,
    nombreCompleto: this.nombreCompleto,
    tipoUsuario: this.tipoUsuario,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
  };
};


mongoose.model('Usuarios', UserSchema);