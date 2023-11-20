interface SmallButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const SmallButton = ({ onClick, className, children }: SmallButtonProps) => {
  return (
    <button
      type="button"
      className={`flex flex-row items-center justify-center px-2 py-1 w-fit min-w-[2.25rem] h-9 gap-2 rounded-xl semibold-18 duration-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SmallButton;
