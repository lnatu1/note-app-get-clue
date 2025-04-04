import { create } from "zustand";
import socket from "@/utils/socket";

interface AuthState {
  username: string;
  setUsername: (username: string) => void;
  isRegistered: () => boolean;
}

const useAuthStore = create<AuthState>((set, get) => {
  const storedUsername = localStorage.getItem("username");

  if (storedUsername) socket.emit("setUsername", storedUsername);

  return {
    username: storedUsername || "",
    setUsername: (username: string) => {
      localStorage.setItem("username", username);
      set({ username });
    },
    isRegistered: () => Boolean(get().username),
  };
});

export default useAuthStore;
