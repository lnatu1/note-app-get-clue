import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="p-4 bg-white rounded-lg shadow">{children}</div>;
};

export default Card;
