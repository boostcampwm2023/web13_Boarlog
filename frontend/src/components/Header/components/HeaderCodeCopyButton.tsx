import SmallButton from "@/components/SmallButton/SmallButton";
import ShareIcon from "@/assets/svgs/share.svg?react";

interface HeaderCodeCopyButtonProps {
  lectureCode: string;
}

const HeaderCodeCopyButton = ({ lectureCode }: HeaderCodeCopyButtonProps) => {
  return (
    <SmallButton onClick={() => console.log("clicked")} className="bg-grayscale-lightgray">
      <ShareIcon className="fill-grayscale-black" />
      {lectureCode}
    </SmallButton>
  );
};

export default HeaderCodeCopyButton;
