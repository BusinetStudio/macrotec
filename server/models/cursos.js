var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var CursoSchema = new mongoose.Schema({
  software: {
    type: String, 
    required: [true, "can't be blank"]
  },
  softwareName: String, 
  codigo: {unique : true, type: String, required: [true, "can't be blank"]},
  modalidad: {
    type: String, 
    enum: ['Presencial', 'Online'],
    required: [true, "can't be blank"]},
  sede: {
    type: String, 
    enum: ['Jesus Maria', 'Santiago de Surco'],
    required: [true, "can't be blank"]
  },
  aula: {type: Number, required: [true, "can't be blank"]},
  cupos: {type: Number, required: [true, "can't be blank"]},
  clases: {type: Number, required: [true, "can't be blank"]},
  profesor: {type: String, required: [true, "can't be blank"]},
  fecha_inicio: {type: Date, required: [true, "can't be blank"]},
  fecha_fin: {type: Date, required: [true, "can't be blank"]},
  hora_inicio: {type: String, required: [true, "can't be blank"]},
  hora_fin: {type: String, required: [true, "can't be blank"]},
  dias: {type: Array, required: [true, "can't be blank"]},
  horas_curso: {type: Number, required: [true, "can't be blank"]},
  precio: {type: Number, required: [true, "can't be blank"]},
  cuotas: {type: Number, required: [true, "can't be blank"]},
  reservas: Number
}, {timestamps: true});

CursoSchema.plugin(uniqueValidator, {message: 'is already taken.'});


mongoose.model('Cursos', CursoSchema);