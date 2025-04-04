import { create } from "zustand";
import axios from "axios";

export interface Note {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  timestamp: Date;
}

interface NoteStore {
  notes: Note[];
  loadNotes: () => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  editNote: (id: string, updatedFields: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  markAsCompleted: (id: string, completed: boolean) => Promise<void>;
}

const URL = "http://localhost:4000/notes";

const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],

  loadNotes: async () => {
    try {
      const res = await axios.get<Note[]>(URL);
      set({ notes: res.data });
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  },

  addNote: async (note) => {
    try {
      await axios.post(URL, note);
      set({ notes: [note, ...get().notes] });
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  },
  deleteNote: async (noteId: string) => {
    try {
      await axios.delete(`${URL}/${noteId}`);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
      }));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  },

  editNote: async (id, updatedFields) => {
    try {
      await axios.put(`${URL}/${id}`, updatedFields);
      const res = await axios.get<Note[]>(URL);
      set({ notes: res.data });
    } catch (err) {
      console.error("Failed to edit note:", err);
    }
  },

  markAsCompleted: async (id, completed) => {
    try {
      await axios.put(`${URL}/${id}`, { completed });
      const res = await axios.get<Note[]>(URL);
      set({ notes: res.data });
    } catch (err) {
      console.error("Failed to update completion status:", err);
    }
  },
}));

export default useNoteStore;
