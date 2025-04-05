import { useEffect } from "react";
import toast from "react-hot-toast";
import socket from "@/utils/socket";
import useAuthStore from "@/store/useAuthStore";

const useNoteSocketEvents = (
  loadNotes: () => void,
  setEditingUsers: React.Dispatch<
    React.SetStateAction<{ [noteId: string]: string[] }>
  >
) => {
  const { username } = useAuthStore();

  useEffect(() => {
    const handleLoadNote = () => {
      loadNotes();
    };

    handleLoadNote();

    const handleNoteAdded = () => {
      toast.success("A new note has been added.");
      handleLoadNote();
    };

    // Listen for "currentEditingNotes" event sent by the server
    socket.on(
      "currentEditingNotes",
      (currentEditingNotes: { noteId: string; username: string }[]) => {
        // If the current user is the only one editing, ignore the update
        if (currentEditingNotes[0]?.username === username) return;
        // Build a new map of editing users grouped by noteId
        const newEditingUsers = currentEditingNotes.reduce(
          (acc, { noteId, username }) => {
            if (!acc[noteId]) {
              acc[noteId] = [];
            }
            acc[noteId].push(username);
            return acc;
          },
          {} as { [noteId: string]: string[] }
        );

        setEditingUsers(newEditingUsers);
      }
    );

    // Listen for the "editingNote" event broadcast from other clients
    socket.on(
      "editingNote",
      ({ noteId, username }: { noteId: string; username: string }) => {
        // Update the local state that tracks which users are editing each note
        setEditingUsers((prev) => {
          const current = prev[noteId] || [];
          // Only add the user if no one else is currently editing this note
          if (current.length === 0) {
            return { ...prev, [noteId]: [username] };
          }
          return prev;
        });
      }
    );

    // Listen for the "stoppedEditing" event sent from other clients who cancel the edit
    socket.on(
      "stoppedEditing",
      ({ noteId, username }: { noteId: string; username: string }) => {
        // Update the state that tracks which users are editing which notes
        setEditingUsers((prev) => {
          if (prev[noteId]) {
            // Remove the username that stopped editing
            const updatedUsers = prev[noteId].filter((u) => u !== username);
            // If no users are left editing this note, remove the noteId key
            if (updatedUsers.length === 0) {
              // Destructure to omit the noteId from the object
              const { [noteId]: _, ...rest } = prev;
              return rest;
            }
            return { ...prev, [noteId]: updatedUsers };
          }
          return prev;
        });
      }
    );

    socket.on("noteAdded", handleNoteAdded);
    socket.on("noteEdited", handleLoadNote);
    socket.on("noteDeleted", handleLoadNote);

    return () => {
      socket.off("noteAdded", handleNoteAdded);
      socket.off("noteEdited", handleLoadNote);
    };
  }, [loadNotes, setEditingUsers, username]);
};

export default useNoteSocketEvents;
