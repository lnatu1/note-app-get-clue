import Notes from "../components/Notes";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import OnlineUsers from "@/components/OnlineUsers";
import NoteModal from "../components/NoteModal";
import { NoteModalProvider } from "@/context/NoteModalContext";
import socket from "@/utils/socket";

const Home = () => {
  socket.emit("userJoined");

  return (
    <>
      <NoteModalProvider>
        <OnlineUsers />
        <Header />
        <Notes />
        <NoteModal />
      </NoteModalProvider>
      <Toaster />
    </>
  );
};

export default Home;
