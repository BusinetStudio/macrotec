var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var CuentasSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, "can't be blank"]},
  ruc: { type: String, required: [true, "can't be blank"]},
  direccion: String,
  distrito: String,
  departamento: String,
  provincia: String,
  telefono: String,
  email: String,
}, {timestamps: true});

CuentasSchema.plugin(uniqueValidator, {message: 'is already taken.'});
 

mongoose.model('Cuentas', CuentasSchema);