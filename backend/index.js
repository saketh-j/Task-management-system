
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('./db.js')
const User = require('./models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Task = require('./models/Task');

app.use(cors())
app.use(express.json())


app.post('/api/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
});

app.get('/api/tasks', async (req, res) => {
	try {
	  const tasks = await Task.find();
	  res.json(tasks);
	} catch (error) {
	  res.status(500).json({ error: 'Server error' });
	}
  });
  
  app.post('/api/tasks', async (req, res) => {
	try {
	  const { name, description, date, status } = req.body;
	  const newTask = new Task({
		name,
		description,
		date,
		status,
	  });
	  await newTask.save();
	  res.json(newTask);
	} catch (error) {
	  res.status(500).json({ error: 'Server error' });
	}
  });
  
  app.put('/api/tasks/:id', async (req, res) => {
	try {
	  const { name, description, date, status } = req.body;
	  const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
		name,
		description,
		date,
		status,
	  });
	  res.json(updatedTask);
	} catch (error) {
	  res.status(500).json({ error: 'Server error' });
	}
  });
  
  app.delete('/api/tasks/:id', async (req, res) => {
	try {
	  const deletedTask = await Task.findByIdAndDelete(req.params.id);
	  res.json(deletedTask);
	} catch (error) {
	  res.status(500).json({ error: 'Server error' });
	}
  });

app.listen(1998, () => {
	console.log('Server started on 1998')
})