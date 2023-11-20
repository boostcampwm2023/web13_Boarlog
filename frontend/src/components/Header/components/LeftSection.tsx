import logoSmall from "@/assets/imgs/logoSmall.png";

interface HeaderProps {
  lecture?: boolean;
  login?: boolean;
  main?: boolean;
}

const LeftSection: React.FC<HeaderProps> = ({ lecture }) => {
  return (
    <div className="flex items-center gap-4 semibold-20">
      <button type="button" className="flex flex-row items-center gap-4">
        <img src={logoSmall} />
        {!lecture && <h1>Boarlog</h1>}
      </button>
      {lecture && <h1>lecture name</h1>}
    </div>
  );
};

export default LeftSection;
