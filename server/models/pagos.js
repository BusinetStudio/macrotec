var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var PagosSchema = new mongoose.Schema({
  reserva: { type: String, required: [true, "can't be blank"]},
  cliente: { type: String, required: [true, "can't be blank"]},
  clienteNombre: { type: String, required: [true, "can't be blank"]},
  dni: { type: String, required: [true, "can't be blank"]},
  cursoNombre: { type: String, required: [true, "can't be blank"]},
  documento: String,
  fecha:{ type: String, required: [true, "can't be blank"]},
  monto: { type: Number, required: [true, "can't be blank"]},
  estado: {type: String, enum: ['Pendiente','Pagado'], default: 'Pendiente', required: [true, "can't be blank"]},
  imgDeposito: String,
}, {timestamps: true});

PagosSchema.plugin(uniqueValidator, {message: 'is already taken.'});


mongoose.model('Pagos', PagosSchema);