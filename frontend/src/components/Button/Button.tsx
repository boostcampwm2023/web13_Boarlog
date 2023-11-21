interface ButtonProps {
  type: "full" | "fit" | "grow";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  value?: string;
}

const Button = ({ type, onClick, className, children, value }: ButtonProps) => {
  return (
    <button
      type="button"
      className={`flex flex-row justify-center items-center gap-1 py-3 rounded-xl semibold-18 hover:opacity-70 duration-500 ${
        type === "full" && "w-full"
      } ${type === "fit" && "px-3 w-fit"} ${type === "grow" && "flex-grow basis-0"} ${className}`}
      onClick={onClick}
      value={value}
    >
      {children}
    </button>
  );
};

export default Button;
