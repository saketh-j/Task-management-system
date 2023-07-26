const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    if (!title || !description || !dueDate || !status) {
      return res.status(400).json({ error: 'Please provide title, description, due date, and status' });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
    });

    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
