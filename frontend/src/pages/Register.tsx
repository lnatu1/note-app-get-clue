import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import Card from "@/components/Card";
import useAuthStore from "@/store/useAuthStore";
import socket from "@/utils/socket";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const { setUsername: saveUsername } = useAuthStore();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    if (username.trim()) {
      saveUsername(username);
      socket.emit("setUsername", username);
      navigate("/");
    } else {
      alert("Please enter a username");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Card>
      <label htmlFor="username" className="text-xl font-medium">
        Enter your username
      </label>
      <div className="mt-4">
        <input
          id="username"
          type="text"
          placeholder="Your username..."
          value={username}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 py-2 px-4"
        />
      </div>

      <div className="mt-4 text-center">
        <Button onClick={handleSubmit} className="w-full">
          Go to home page
        </Button>
      </div>
    </Card>
  );
};

export default Register;
