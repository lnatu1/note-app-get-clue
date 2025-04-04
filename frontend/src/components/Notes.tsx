import { useState } from "react";
import moment from "moment";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import toast from "react-hot-toast";
import useNoteModal from "@/context/NoteModalContext";
import useNoteStore from "../store/useNoteStore";
import useNoteSocketEvents from "@/hooks/useNoteSocket";
import Card from "./Card";
import Button from "./Button";

const Notes = () => {
  const { openModal } = useNoteModal();
  const { notes, loadNotes, deleteNote, markAsCompleted } = useNoteStore();
  const [editingUsers, setEditingUsers] = useState<{
    [noteId: string]: string[];
  }>({});

  const canDoAction = (noteId: string) =>
    editingUsers[noteId] && editingUsers[noteId].length > 0;

  const handleDeleteNote = (noteId: string) => {
    if (canDoAction(noteId)) {
      toast.error("You cannot delete this note while it is being edited.");
    } else {
      deleteNote(noteId);
      toast.success("Note deleted successfully.");
    }
  };

  const handleMarkAsCompleted = (noteId: string, completed: boolean) => {
    if (canDoAction(noteId)) {
      toast.error("Another user is already editing this note.");
    } else {
      markAsCompleted(noteId, completed);
      toast.success("Note completed");
    }
  };

  useNoteSocketEvents(loadNotes, setEditingUsers);

  return (
    <div className="mt-4">
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="mb-4">
            <Card>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-medium text-2xl flex items-center p-0 hover:no-underline cursor-pointer">
                    <div>
                      <div>
                        {note.title} {note.completed ? "✅" : "⏳"}
                      </div>

                      <div className="text-sm text-gray-500">
                        {moment(
                          new Date(note.timestamp),
                          "M/D/YYYY h:mm:ss A"
                        ).format("MMMM D, YYYY, HH:mm")}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="mt-4 text-lg"
                      dangerouslySetInnerHTML={{ __html: note.description }}
                    />
                    <div className="flex gap-2 mt-4">
                      {editingUsers[note.id] &&
                        editingUsers[note.id].length > 0 &&
                        editingUsers[note.id].map((userName) => (
                          <div
                            key={userName}
                            className="inline-block rounded bg-amber-500 text-white font-medium p-2 leading-none"
                          >
                            {userName} is editing this note
                          </div>
                        ))}
                    </div>
                    <div className="text-right mt-4">
                      <Button
                        variant="danger"
                        className="text-lg mr-2"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        className="text-lg bg-cyan-500 mr-2"
                        onClick={() => openModal(note)}
                      >
                        Edit
                      </Button>
                      {note.completed ? (
                        <Button
                          variant="danger"
                          className="text-lg"
                          onClick={() => handleMarkAsCompleted(note.id, false)}
                        >
                          Mark as Incomplete
                        </Button>
                      ) : (
                        <Button
                          className="text-lg bg-green-500"
                          onClick={() => handleMarkAsCompleted(note.id, true)}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
