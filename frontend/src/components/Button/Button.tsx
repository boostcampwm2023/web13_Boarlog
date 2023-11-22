interface ButtonProps {
  type: "full" | "fit" | "grow";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  value?: string;
  buttonStyle: "black" | "gray" | "red" | "blue";
}

const BUTTON_STYLES = {
  black: "bg-grayscale-black text-grayscale-white",
  gray: "bg-grayscale-lightgray text-grayscale-black",
  red: "bg-alert-100 text-grayscale-white",
  blue: "bg-boarlog-100 text-grayscale-white"
};

const Button = ({ type, onClick, className, children, value, buttonStyle }: ButtonProps) => {
  return (
    <button
      type="button"
      className={`flex flex-row justify-center items-center gap-1 py-3 rounded-xl semibold-18 hover:opacity-70 duration-500 ${
        type === "full" && "w-full"
      } ${type === "fit" && "px-3 w-fit"} ${type === "grow" && "flex-grow basis-0"} ${
        BUTTON_STYLES[buttonStyle]
      } ${className}`}
      onClick={onClick}
      value={value}
    >
      {children}
    </button>
  );
};

export default Button;
