import { create } from "zustand";
import socket from "@/utils/socket";

interface AuthState {
  username: string;
  setUsername: (username: string) => void;
  isRegistered: () => boolean;
}

const useAuthStore = create<AuthState>((set, get) => {
  const storedUsername = localStorage.getItem("username");

  // If a username is found, notify the server via socket
  if (storedUsername) socket.emit("setUsername", storedUsername);

  return {
    username: storedUsername || "",
    /**
     * Updates the username both in the store and localStorage
     * @param username string
     */
    setUsername: (username: string) => {
      localStorage.setItem("username", username);
      set({ username });
    },
    /**
     * Determines if a user is registered based on username
     * @returns True if username exists, false otherwise
     */
    isRegistered: () => Boolean(get().username),
  };
});

export default useAuthStore;
