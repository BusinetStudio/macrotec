var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ReservaSchema = new mongoose.Schema({
  vendedor: {type: String, required: [true, "can't be blank"]},
  vendedorNombre: {type: String, required: [true, "can't be blank"]},
  potencial: {unique : true, type: String, required: [true, "can't be blank"]},
  potencialNombre: {type: String, required: [true, "can't be blank"]},
  dni: {type: String, required: [true, "can't be blank"], unique : true},
  telefono: { type: String, required: [true, "can't be blank"] },
  celular: { type: String, required: [true, "can't be blank"] },
  email: {type: String, required: [true, "can't be blank"] },
  fechaReserva: {type: String, required: [true, "can't be blank"]},
  curso: {type: String, required: [true, "can't be blank"]},
  cursoCodigo: {type: String, required: [true, "can't be blank"]},
  cursoNombre: {type: String, required: [true, "can't be blank"]},
  montoPagado: {type: Number, default: 0},
  estado: {type: String, enum: ['Pendiente','Matriculado'], default: 'Pendiente', required: [true, "can't be blank"]},
  comentarios: String,
}, {timestamps: true});

ReservaSchema.plugin(uniqueValidator, {message: 'is already taken.'});


mongoose.model('Reservas', ReservaSchema);