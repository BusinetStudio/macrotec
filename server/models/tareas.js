var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var TareasSchema = new mongoose.Schema({
  potencial: { type: String, required: [true, "can't be blank"]},
  usuario_id: { type: String, required: [true, "can't be blank"]},
  usuario_nombre: { type: String, required: [true, "can't be blank"]},
  tarea: { type: String, required: [true, "can't be blank"]},
  estado: {type: String, enum: ['Pendiente', ' Completado'] },
  fecha: String,
  hora: String,
}, {timestamps: true});

TareasSchema.plugin(uniqueValidator, {message: 'is already taken.'});
 

mongoose.model('Tareas', TareasSchema);