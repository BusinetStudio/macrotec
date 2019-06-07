var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ActividadesSchema = new mongoose.Schema({
  potencial: { type: String, required: [true, "can't be blank"]},
  actividad: { type: String, required: [true, "can't be blank"]},
  fecha: String,
  hora: String,
}, {timestamps: true});

ActividadesSchema.plugin(uniqueValidator, {message: 'is already taken.'});
 

mongoose.model('Actividades', ActividadesSchema);