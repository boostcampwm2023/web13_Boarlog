interface ButtonProps {
  type: "full" | "fit" | "grow";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  value?: string;
  buttonStyle: "black" | "gray" | "red" | "blue";
  ariaLabel?: string;
}

const BUTTON_STYLES = {
  black: "bg-grayscale-black text-grayscale-white",
  gray: "bg-grayscale-lightgray text-grayscale-black",
  red: "bg-alert-100 text-grayscale-white",
  blue: "bg-boarlog-100 text-grayscale-white"
};

Object.freeze(BUTTON_STYLES);

const Button = ({ type, onClick, className, children, value, buttonStyle, ariaLabel }: ButtonProps) => {
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
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
