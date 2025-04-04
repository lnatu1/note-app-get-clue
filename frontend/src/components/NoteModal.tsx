import { useEffect, useState, useCallback } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import DatePicker from "react-datepicker";
import Button from "./Button";
import Card from "./Card";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import useNoteStore, { Note } from "../store/useNoteStore";
import useNoteModal from "@/context/NoteModalContext";

const defaultNote = (): Note => ({
  id: uuid(),
  title: "",
  description: "",
  completed: false,
  timestamp: new Date(),
});

const NoteModal = () => {
  const { addNote, editNote } = useNoteStore();
  const { isOpen, selectedNote, setEditNote, closeModal } = useNoteModal();
  const [note, setNote] = useState<Note>(defaultNote);

  const handleInputChange = useCallback(
    (value: string | Date | null, key: keyof Note) => {
      if (!value || value === "<p><br></p>") return;
      setNote((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const submit = useCallback(async () => {
    if (selectedNote) {
      await editNote(note.id, note);
      toast.success("Note updated successfully!");
      setEditNote(null);
    } else {
      addNote({ ...note, id: uuid() });
      setNote(defaultNote());
    }
    closeModal();
  }, [note, selectedNote, editNote, addNote, closeModal, setEditNote]);

  useEffect(() => {
    setNote(
      selectedNote
        ? { ...selectedNote, timestamp: new Date(selectedNote.timestamp) }
        : defaultNote()
    );
  }, [selectedNote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 animate-fadeIn">
      <div className="transform transition-transform scale-95 animate-scaleIn max-w-2xl w-full">
        <Card>
          <h2 className="font-medium text-xl">
            {selectedNote ? "Edit note" : "Create new note"}
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-lg font-medium">Title</label>
              <input
                className="border outline-blue-400 border-[#ccc] px-4 py-2 text-lg w-full block mt-3"
                type="text"
                placeholder="Title"
                value={note.title}
                onChange={(e) => handleInputChange(e.target.value, "title")}
              />
            </div>
            <div>
              <label className="text-lg font-medium">Description</label>
              <ReactQuill
                key={note.id}
                theme="snow"
                value={note.description}
                onChange={(v) => handleInputChange(v, "description")}
                className="mt-3"
              />
            </div>
            <div>
              <label className="text-lg font-medium">Deadline</label>
              <div>
                <DatePicker
                  showTimeSelect
                  selected={note.timestamp}
                  onChange={(date) => handleInputChange(date, "timestamp")}
                  timeFormat="HH:mm"
                  dateFormat="MMMM d, yyyy HH:mm"
                  timeCaption="Time"
                  className="border outline-blue-400 border-[#ccc] px-4 py-2 text-lg mt-3"
                />
              </div>
            </div>
          </div>
          <div className="text-right mt-4">
            <Button variant="danger" onClick={closeModal}>
              Close
            </Button>
            <Button className="ml-2" onClick={submit}>
              {selectedNote ? "Edit" : "Create"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NoteModal;
