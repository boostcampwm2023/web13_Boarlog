import SmallButton from "@/components/SmallButton/SmallButton";
import ShareIcon from "@/assets/svgs/share.svg?react";
import { useToast } from "@/components/Toast/useToast";

interface HeaderCodeCopyButtonProps {
  lectureCode: string;
}

const HeaderCodeCopyButton = ({ lectureCode }: HeaderCodeCopyButtonProps) => {
  const showToast = useToast();
  const handleShareButtonClicked = async () => {
    try {
      await navigator.clipboard.writeText(
        `[함께 듣는 실시간 강의 Boarlog]\n\n지금 진행되는 강의에 참여해보세요.\n\n강의 코드: ${lectureCode}\n강의 제목: 강의 제목\n강의 링크: 강의 링크`
      );
      showToast({ message: "클립보드에 강의 코드를 복사했어요.", type: "success" });
    } catch (error) {
      console.error("복사 실패:", error);
      showToast({ message: "강의 코드 복사에 실패했어요. 잠시 후 다시 시도해 주세요.", type: "alert" });
    }
  };

  return (
    <SmallButton onClick={handleShareButtonClicked} className="bg-grayscale-lightgray">
      <ShareIcon className="fill-grayscale-black" />
      {lectureCode}
    </SmallButton>
  );
};

export default HeaderCodeCopyButton;
