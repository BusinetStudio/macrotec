var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var PotencialesSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: [true, "can't be blank"]},
  dni: {type: String, required: [true, "can't be blank"], unique : true},
  telefono: { type: String, required: [true, "can't be blank"] },
  celular: { type: String, required: [true, "can't be blank"] },
  email: {type: String, required: [true, "can't be blank"] },
  cursoInteres: [],
  cursoInteresCodigo:[],
  vendedorAsignado: {type: String, required: [true, "can't be blank"] },
  vendedorAsignadoNombre: {type: String, required: [true, "can't be blank"] },
  cuenta: String
}, {timestamps: true});

PotencialesSchema.plugin(uniqueValidator, {message: 'is already taken.'});


mongoose.model('Potenciales', PotencialesSchema);