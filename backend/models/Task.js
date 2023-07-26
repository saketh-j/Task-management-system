const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo',
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
