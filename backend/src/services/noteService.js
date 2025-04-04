const {
  getNotesRepository,
  addNoteRepository,
  updateNoteRepository,
  deleteNoteRepository,
} = require("../repositories/noteRepo");

const getAllNotes = () => {
  return getNotesRepository();
};

const addNote = (note) => {
  addNoteRepository(note);
};

const updateNoteById = (id, updatedNote) => {
  updateNoteRepository(id, updatedNote);
};

const removeNoteById = (id) => {
  deleteNoteRepository(id);
};

module.exports = { getAllNotes, addNote, updateNoteById, removeNoteById };
