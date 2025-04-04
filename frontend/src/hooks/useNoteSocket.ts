import { useEffect } from "react";
import toast from "react-hot-toast";
import socket from "@/utils/socket";

const useNoteSocketEvents = (
  loadNotes: () => void,
  setEditingUsers: React.Dispatch<
    React.SetStateAction<{ [noteId: string]: string[] }>
  >
) => {
  useEffect(() => {
    const handleLoadNote = () => {
      loadNotes();
    };

    handleLoadNote();

    const handleNoteAdded = () => {
      toast.success("A new note has been added.");
      handleLoadNote();
    };

    socket.on(
      "currentEditingNotes",
      (currentEditingNotes: { noteId: string; username: string }[]) => {
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

    socket.on(
      "editingNote",
      ({ noteId, username }: { noteId: string; username: string }) => {
        console.log(12876386);
        setEditingUsers((prev) => {
          const current = prev[noteId] || [];
          if (current.length === 0) {
            return { ...prev, [noteId]: [username] };
          }
          return prev;
        });
      }
    );

    socket.on(
      "stoppedEditing",
      ({ noteId, username }: { noteId: string; username: string }) => {
        setEditingUsers((prev) => {
          if (prev[noteId]) {
            const updatedUsers = prev[noteId].filter((u) => u !== username);
            if (updatedUsers.length === 0) {
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
  }, [loadNotes, setEditingUsers]);
};

export default useNoteSocketEvents;
