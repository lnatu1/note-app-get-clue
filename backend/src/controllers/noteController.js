const {
  getAllNotes,
  addNote,
  updateNoteById,
  removeNoteById,
} = require("../services/noteService");
const {
  emitNoteAdded,
  emitNoteEdited,
  emitNoteDeleted,
} = require("../events/socket");

const getNotes = (_, res) => {
  const notes = getAllNotes();
  res.json(notes);
};

const createNote = (req, res) => {
  const newNote = req.body;
  addNote(newNote);
  emitNoteAdded(req.app.get("io"));
  res.sendStatus(201);
};

const updateNote = (req, res) => {
  const { id } = req.params;
  const updatedNote = req.body;
  updateNoteById(id, updatedNote);
  emitNoteEdited(req.app.get("io"));
  res.sendStatus(200);
};

const deleteNote = (req, res) => {
  const { id } = req.params;
  removeNoteById(id);
  emitNoteDeleted(req.app.get("io"));
  res.sendStatus(200);
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
