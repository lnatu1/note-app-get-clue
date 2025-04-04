import { useEffect, useState } from "react";
import Card from "./Card";
import socket from "@/utils/socket";

const NameCard = ({ name }: { name: string }) => {
  return (
    <div className="w-[50px] h-[50px] rounded-full flex bg-blue-700 items-center justify-center text-white font-bold border-white border-2">
      {name[0].toUpperCase()}
    </div>
  );
};

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("userList", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("userList");
    };
  }, []);

  return (
    <Card>
      <div className="flex">
        {onlineUsers.map((user) => (
          <NameCard key={user} name={user} />
        ))}
      </div>
    </Card>
  );
};

export default OnlineUsers;
