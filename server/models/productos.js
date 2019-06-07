var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ProductoSchema = new mongoose.Schema({
  nombre: {type: String, required: [true, "can't be blank"]},
  codigo: {unique : true, type: String, required: [true, "can't be blank"]},
}, {timestamps: true});

ProductoSchema.plugin(uniqueValidator, {message: 'is already taken.'});


mongoose.model('Productos', ProductoSchema);