import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', options: ['', '', '', ''], answer: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    const res = await axios.get('https://flash-card-react-ten.vercel.app/flashcards');
    setFlashcards(res.data);
  };

  const createOrUpdateFlashcard = async () => {
    if (editing) {
      await axios.put(`https://flash-card-react-ten.vercel.app/flashcards/${editing}`, newFlashcard);
      setEditing(null);
    } else {
      await axios.post('https://flash-card-react-ten.vercel.app/flashcards', newFlashcard);
    }
    setNewFlashcard({ question: '', options: ['', '', '', ''], answer: '' });
    fetchFlashcards();
  };

  const editFlashcard = (flashcard) => {
    setNewFlashcard(flashcard);
    setEditing(flashcard._id);
  };

  const deleteFlashcard = async (id) => {
    await axios.delete(`https://flash-card-react-ten.vercel.app/flashcards/${id}`);
    fetchFlashcards();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-purple-800 text-white">
      <div className="w-full max-w-lg p-8 bg-purple-700 shadow-2xl rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <input
          type="text"
          placeholder="Question"
          value={newFlashcard.question}
          onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
          className="w-full p-3 mb-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-4">
          {newFlashcard.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) =>
                setNewFlashcard({
                  ...newFlashcard,
                  options: newFlashcard.options.map((opt, i) => (i === index ? e.target.value : opt)),
                })
              }
              className="w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <input
          type="text"
          placeholder="Answer"
          value={newFlashcard.answer}
          onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
          className="w-full p-3 mt-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createOrUpdateFlashcard}
          className="w-full mt-6 py-3 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
        >
          {editing ? 'Update' : 'Create'} Flashcard
        </button>

        <ul className="mt-8 space-y-4">
          {flashcards.map((flashcard) => (
            <li key={flashcard._id} className="p-4 bg-purple-600 rounded-lg shadow">
              <p className="text-white font-medium">{flashcard.question}</p>
              <div className="flex mt-2 space-x-2">
                <button
                  onClick={() => editFlashcard(flashcard)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFlashcard(flashcard._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
