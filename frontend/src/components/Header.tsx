import useNoteModal from "@/context/NoteModalContext";
import Button from "./Button";
import Card from "./Card";
import useAuthStore from "@/store/useAuthStore";
import moment from "moment";

const Header = () => {
  const { username } = useAuthStore();
  const { openModal } = useNoteModal();

  return (
    <div className="my-4">
      <Card>
        <div className="flex justify-between items-center">
          <div className="font-medium">
            <div className="text-2xl">Hello {username}</div>
            <div className="text-gray-400">
              {moment(new Date(new Date()), "M/D/YYYY h:mm:ss A").format(
                "MMMM D, YYYY"
              )}
            </div>
          </div>
          <div>
            <Button onClick={() => openModal()}>Add new note</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Header;
