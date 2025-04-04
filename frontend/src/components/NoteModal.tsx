import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import ReactQuill from "react-quill-new";
import DatePicker from "react-datepicker";
import Button from "./Button";
import Card from "./Card";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import useNoteStore, { Note } from "../store/useNoteStore";
import useNoteModal from "@/context/NoteModalContext";

const NoteModal = () => {
  const { addNote, editNote } = useNoteStore();
  const { isOpen, selectedNote, setEditNote, closeModal } = useNoteModal();
  const [note, setNote] = useState<Note>({
    id: "",
    title: "",
    description: "",
    completed: false,
    timestamp: new Date(),
  });

  const handleInputChange = (value: string | Date | null, key: string) => {
    if (!value || value === "<p><br></p>") return;

    setNote((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = () => {
    if (selectedNote) {
      editNote(note.id, note);
      setEditNote(null);
    } else {
      addNote({ ...note, id: uuid() });
      setNote({
        id: uuid(),
        title: "",
        description: "",
        completed: false,
        timestamp: new Date(),
      });
    }

    closeModal();
  };

  useEffect(() => {
    if (selectedNote) {
      setNote({ ...selectedNote, timestamp: new Date(selectedNote.timestamp) });
    } else {
      setNote({
        id: uuid(),
        title: "",
        description: "",
        completed: false,
        timestamp: new Date(),
      });
    }
  }, [selectedNote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 animate-fadeIn">
      <div className="transform transition-transform scale-95 animate-scaleIn max-w-2xl w-full">
        <Card>
          <div className="font-medium text-xl">
            {selectedNote ? "Edit note" : "Create new note"}
          </div>
          <div className="mt-4">
            <div>
              <label htmlFor="" className="text-lg font-medium">
                Title
              </label>
              <div className="mt-3">
                <input
                  className="border outline-blue-400 border-[#ccc] px-4 py-2 text-lg w-full block"
                  type="text"
                  placeholder="Title"
                  value={note.title}
                  onChange={(e) => handleInputChange(e.target.value, "title")}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="" className="text-lg font-medium">
                Description
              </label>
              <div className="mt-3">
                <ReactQuill
                  key={note.id}
                  theme="snow"
                  value={note.description}
                  onChange={(v) => handleInputChange(v, "description")}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="" className="text-lg font-medium">
                Deadline
              </label>
              <div className="mt-3">
                <DatePicker
                  showTimeSelect
                  selected={note.timestamp}
                  onChange={(date) => handleInputChange(date, "timestamp")}
                  timeFormat="HH:mm"
                  dateFormat="MMMM d, yyyy HH:mm"
                  timeCaption="Time"
                  className="border outline-blue-400 border-[#ccc] px-4 py-2 text-lg"
                />
              </div>
            </div>
          </div>
          <div className="text-right mt-4">
            <Button variant="danger" onClick={() => closeModal()}>
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
