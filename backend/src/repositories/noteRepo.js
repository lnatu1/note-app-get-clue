let notes = [
  {
    id: "1",
    title: "Note 1",
    description: "This is note 1.",
    completed: false,
    timestamp: new Date(),
  },
  {
    id: "2",
    title: "Note 2",
    description: "This is note 2.",
    completed: false,
    timestamp: new Date(),
  },
];

const getNotesRepository = () => notes;

const addNoteRepository = (note) => {
  notes.unshift(note);
};

const updateNoteRepository = (id, updatedNote) => {
  notes = notes.map((note) =>
    note.id === id ? { ...note, ...updatedNote } : note
  );
};

const deleteNoteRepository = (id) => {
  notes = notes.filter((note) => note.id !== id);
};

module.exports = {
  getNotesRepository,
  addNoteRepository,
  updateNoteRepository,
  deleteNoteRepository,
};
