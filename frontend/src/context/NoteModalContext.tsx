import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";
import { Note } from "@/store/useNoteStore";
import socket from "@/utils/socket";

interface NoteModalContextProps {
  isOpen: boolean;
  selectedNote: Note | null;
  setEditNote: (note: Note | null) => void;
  openModal: (note?: Note | null) => void;
  closeModal: () => void;
}

const NoteModalContext = createContext<NoteModalContextProps | undefined>(
  undefined
);

export const NoteModalProvider = ({ children }: { children: ReactNode }) => {
  const { username } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const setEditNote = useCallback((note: Note | null) => {
    setSelectedNote(note);
  }, []);

  const openModal = useCallback(
    (note?: Note | null) => {
      if (note) {
        socket.emit(
          "editingNote",
          { noteId: note.id, username },
          (response: { conflict: boolean; editor?: string }) => {
            if (response.conflict) {
              toast.error("Another user is already editing this note.");
            } else {
              setSelectedNote(note);
              setIsOpen(true);
            }
          }
        );
      } else {
        setIsOpen(true);
      }
    },
    [username]
  );

  const closeModal = useCallback(() => {
    if (selectedNote) {
      socket.emit("stoppedEditing", { noteId: selectedNote.id, username });
    }
    setIsOpen(false);
    setSelectedNote(null);
  }, [selectedNote, username]);

  return (
    <NoteModalContext.Provider
      value={{ isOpen, selectedNote, setEditNote, openModal, closeModal }}
    >
      {children}
    </NoteModalContext.Provider>
  );
};

export default function useNoteModal() {
  const context = useContext(NoteModalContext);
  if (!context) {
    throw new Error("useNoteModal must be used within a NoteModalProvider");
  }
  return context;
}
