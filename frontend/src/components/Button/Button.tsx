interface ButtonProps {
  type: "full" | "fit" | "grow";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button = ({ type, onClick, className, children }: ButtonProps) => {
  return (
    <button
      type="button"
      className={`flex flex-row justify-center items-center gap-1 py-3 rounded-xl semibold-18 duration-500 ${
        type === "full" && "w-full"
      } ${type === "fit" && "px-3 w-fit"} ${type === "grow" && "flex-grow"} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
