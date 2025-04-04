import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface ButtonProps {
  onClick: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
  variant = "primary",
}) => {
  const variantClasses = clsx({
    "bg-blue-600": variant === "primary",
    "bg-gray-600": variant === "secondary",
    "bg-red-600": variant === "danger",
  });

  return (
    <button
      className={twMerge(
        "cursor-pointer text-white py-2 px-4 rounded-lg transition max-sm:text-sm",
        variantClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
