import { PropsWithChildren } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Notes from "@/components/Notes";
import toast from "react-hot-toast";

// Fake data
const fakeNote = {
  id: "1",
  title: "Test Note",
  description: "<p>Test description</p>",
  completed: false,
  timestamp: new Date(),
};

// Mock functions for store and modal actions
const mockDeleteNote = jest.fn();
const mockMarkAsCompleted = jest.fn();
const mockLoadNotes = jest.fn();
const mockOpenModal = jest.fn();

// NoteModal context
jest.mock("../context/NoteModalContext", () => ({
  __esModule: true,
  default: () => ({ openModal: mockOpenModal }),
}));

// NoteStore
jest.mock("../store/useNoteStore", () => ({
  __esModule: true,
  default: () => ({
    notes: [fakeNote],
    loadNotes: mockLoadNotes,
    deleteNote: mockDeleteNote,
    markAsCompleted: mockMarkAsCompleted,
  }),
}));

// NoteSocket hook
jest.mock("../hooks/useNoteSocket", () => ({
  __esModule: true,
  default: () => {},
}));

// Toast notifications
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// UI components used in NoteItem
jest.mock("../components/ui/accordion", () => ({
  Accordion: ({ children }: PropsWithChildren) => <div>{children}</div>,
  AccordionItem: ({ children }: PropsWithChildren) => <div>{children}</div>,
  AccordionTrigger: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
  AccordionContent: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));
jest.mock("../components/Card", () => (props: PropsWithChildren) => (
  <div>{props.children}</div>
));
jest.mock("../components/Button", () => (props: PropsWithChildren) => (
  <button {...props}>{props.children}</button>
));


describe("Notes Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders note and its buttons", () => {
    render(<Notes />);
    // Check for note title
    expect(screen.getByText(/Test Note/)).toBeInTheDocument();

    // Check for expanding the note
    fireEvent.click(screen.getByText(/Test Note/));

    // Check that action buttons are rendered
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Mark as Completed")).toBeInTheDocument();
  });

  test("deletes note when Delete button is clicked", () => {
    render(<Notes />);
    fireEvent.click(screen.getByText(/Test Note/));
    fireEvent.click(screen.getByText("Delete"));

    expect(mockDeleteNote).toHaveBeenCalledWith("1");
    expect(toast.success).toHaveBeenCalledWith("Note deleted successfully.");
  });

  test("marks note as completed when button is clicked", () => {
    render(<Notes />);
    fireEvent.click(screen.getByText(/Test Note/));
    fireEvent.click(screen.getByText("Mark as Completed"));

    expect(mockMarkAsCompleted).toHaveBeenCalledWith("1", true);
    expect(toast.success).toHaveBeenCalledWith("Note mark as completed");
  });

  test("opens modal when Edit button is clicked", () => {
    render(<Notes />);
    fireEvent.click(screen.getByText(/Test Note/));
    fireEvent.click(screen.getByText("Edit"));

    expect(mockOpenModal).toHaveBeenCalledWith(fakeNote);
  });
});
