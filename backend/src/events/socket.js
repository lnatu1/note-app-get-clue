const socketUsernames = new Map(); // Maps socketId to username
const usersEditing = new Map();
let onlineUsers = [];
let notes = [];

const emitNoteAdded = (io) => {
  io.emit("noteAdded");
};

const emitNoteEdited = (io) => {
  io.emit("noteEdited");
};

const emitNoteDeleted = (io) => {
  io.emit("noteDeleted");
};

const getUsernameBySocketId = (socketId) => {
  return socketUsernames.get(socketId);
};

const handleSocketEvents = (io) => {
  io.on("connection", (socket) => {
    let username = null;

    socket.on("userJoined", () => {
      io.emit("userList", onlineUsers);
      io.emit(
        "currentEditingNotes",
        Array.from(usersEditing.entries()).map(([noteId, socketId]) => ({
          noteId,
          username: getUsernameBySocketId(socketId),
        }))
      );
    });

    socket.on("setUsername", (name) => {
      if (name) {
        username = name;
        socketUsernames.set(socket.id, username);
        if (!onlineUsers.includes(username)) {
          onlineUsers.push(username);
        }
        io.emit("userList", onlineUsers);
      }
    });

    socket.on("editingNote", ({ noteId, username }, callback) => {
      if (usersEditing.has(noteId)) {
        const currentEditorSocketId = usersEditing.get(noteId);
        const currentEditorUsername = socketUsernames.get(
          currentEditorSocketId
        );
        callback({ conflict: true, editor: currentEditorUsername });
      } else {
        usersEditing.set(noteId, socket.id);
        callback({ conflict: false });
        socket.broadcast.emit("editingNote", {
          noteId,
          username,
          socketId: socket.id,
        });
      }
    });

    socket.on("stoppedEditing", ({ noteId, username }) => {
      if (usersEditing.get(noteId) === socket.id) {
        usersEditing.delete(noteId);
        socket.broadcast.emit("stoppedEditing", { noteId, username });
      }
    });

    socket.on("updateNote", (updatedNote) => {
      const index = notes.findIndex((note) => note.id === updatedNote.id);
      if (index !== -1) {
        const existingNote = notes[index];
        if (existingNote.description !== updatedNote.description) {
          socket.emit("conflict", "The note has been updated by another user.");
        } else {
          notes[index] = updatedNote;
          io.emit("notes", notes);
        }
      }
    });

    socket.on("disconnect", () => {
      usersEditing.forEach((socketId, noteId) => {
        if (socketId === socket.id) {
          usersEditing.delete(noteId);
          socket.broadcast.emit("stoppedEditing", { noteId });
        }
      });

      onlineUsers = onlineUsers.filter((user) => user !== username);
      io.emit("userList", onlineUsers);
    });
  });
};

module.exports = {
  handleSocketEvents,
  emitNoteAdded,
  emitNoteEdited,
  emitNoteDeleted,
};
