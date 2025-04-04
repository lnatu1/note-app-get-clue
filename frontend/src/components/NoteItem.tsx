import { memo } from "react";
import moment from "moment";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Note } from "../store/useNoteStore";
import Card from "./Card";
import Button from "./Button";

interface NoteItemProps {
  note: Note;
  editingUsers?: string[];
  onDelete: (noteId: string) => void;
  onMarkCompleted: (noteId: string, completed: boolean) => void;
  onEdit: (note: Note) => void;
}

const NoteItem = memo(
  ({
    note,
    editingUsers = [],
    onDelete,
    onMarkCompleted,
    onEdit,
  }: NoteItemProps) => {
    return (
      <li className="mb-4">
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
                  {editingUsers &&
                    editingUsers.length > 0 &&
                    editingUsers.map((userName) => (
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
                    onClick={() => onDelete(note.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    className="text-lg bg-cyan-500 mr-2"
                    onClick={() => onEdit(note)}
                  >
                    Edit
                  </Button>
                  {note.completed ? (
                    <Button
                      variant="danger"
                      className="text-lg"
                      onClick={() => onMarkCompleted(note.id, false)}
                    >
                      Mark as Incomplete
                    </Button>
                  ) : (
                    <Button
                      className="text-lg bg-green-500"
                      onClick={() => onMarkCompleted(note.id, true)}
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
    );
  }
);

export default NoteItem;
