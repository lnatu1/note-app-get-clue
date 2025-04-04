import { useState, memo } from "react";
import toast from "react-hot-toast";
import useNoteModal from "../context/NoteModalContext";
import useNoteStore, { Note } from "../store/useNoteStore";
import useNoteSocketEvents from "../hooks/useNoteSocket";
import NoteItem from "./NoteItem";

interface EditingUsersState {
  [noteId: string]: string[];
}

const Notes = memo(() => {
  const { openModal } = useNoteModal();
  const { notes, loadNotes, deleteNote, markAsCompleted } = useNoteStore();
  const [editingUsers, setEditingUsers] = useState<EditingUsersState>({});

  const handleDeleteNote = (noteId: string) => {
    if (editingUsers[noteId] && editingUsers[noteId].length > 0) {
      toast.error("Another user is already editing this note.");
    } else {
      deleteNote(noteId);
      toast.success("Note deleted successfully.");
    }
  };

  const handleMarkAsCompleted = (noteId: string, completed: boolean) => {
    if (editingUsers[noteId] && editingUsers[noteId].length > 0) {
      toast.error("Another user is already editing this note.");
    } else {
      markAsCompleted(noteId, completed);
      toast.success(
        `${completed ? "Note mark as completed" : "Note mark as Incomplete"}`
      );
    }
  };

  const handleEdit = (note: Note) => {
    openModal(note);
  };

  useNoteSocketEvents(loadNotes, setEditingUsers);

  return (
    <div className="mt-4">
      <ul>
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            editingUsers={editingUsers[note.id]}
            onDelete={handleDeleteNote}
            onMarkCompleted={handleMarkAsCompleted}
            onEdit={handleEdit}
          />
        ))}
      </ul>
    </div>
  );
});

export default Notes;
