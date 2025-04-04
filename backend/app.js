const express = require("express");
const cors = require("cors");
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("./src/controllers/noteController");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/notes", getNotes);
app.post("/notes", createNote);
app.put("/notes/:id", updateNote);
app.delete("/notes/:id", deleteNote);

module.exports = app;
