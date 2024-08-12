const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Create a flashcard
app.post('/flashcards', async (req, res) => {
  const { question, options, answer } = req.body;

  try {
    const [result] = await pool.promise().query(
      'INSERT INTO flashcards (question, options, answer) VALUES (?, ?, ?)',
      [question, JSON.stringify(options), answer]
    );

    res.status(201).send('Flashcard created');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update a flashcard
app.put('/flashcards/:id', async (req, res) => {
  const { id } = req.params;
  const { question, options, answer } = req.body;

  try {
    const [result] = await pool.promise().query(
      'UPDATE flashcards SET question = ?, options = ?, answer = ? WHERE id = ?',
      [question, JSON.stringify(options), answer, id]
    );

    if (result.affectedRows === 0) return res.status(404).send('Flashcard not found');
    res.send('Flashcard updated');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a flashcard
app.delete('/flashcards/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.promise().query(
      'DELETE FROM flashcards WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) return res.status(404).send('Flashcard not found');
    res.send('Flashcard deleted');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all flashcards
app.get('/flashcards', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM flashcards');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Check if the answer is correct
app.post('/flashcards/:id/answer', async (req, res) => {
  const { id } = req.params;
  const { selectedOption } = req.body;

  try {
    const [rows] = await pool.promise().query('SELECT * FROM flashcards WHERE id = ?', [id]);

    if (rows.length === 0) return res.status(404).send('Flashcard not found');

    const flashcard = rows[0];
    const isCorrect = flashcard.answer === selectedOption;
    res.json({ isCorrect });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
