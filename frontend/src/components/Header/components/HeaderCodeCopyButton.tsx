import SmallButton from "@/components/SmallButton/SmallButton";
import ShareIcon from "@/assets/svgs/share.svg?react";
import { useToast } from "@/components/Toast/useToast";

interface HeaderCodeCopyButtonProps {
  lectureCode: string;
}

const getClipboardText = (lectureCode: string) => {
  return `[함께 듣는 실시간 강의 Boarlog]\n\n지금 진행되는 강의에 참여해 보세요.\n\n강의 코드: ${lectureCode}\n강의 제목: 화이트보드 테스트\n강의 링크: ${
    import.meta.env.VITE_BOARLOG_BASE_URL
  }/participant?roomid=${lectureCode}`;
};

const HeaderCodeCopyButton = ({ lectureCode }: HeaderCodeCopyButtonProps) => {
  const showToast = useToast();
  const handleShareButtonClicked = async () => {
    try {
      await navigator.clipboard.writeText(getClipboardText(lectureCode));
      showToast({ message: "클립보드에 강의 코드를 복사했어요.", type: "success" });
    } catch (error) {
      console.error("복사 실패:", error);
      showToast({ message: "강의 코드 복사에 실패했어요. 잠시 후 다시 시도해 주세요.", type: "alert" });
    }
  };

  return (
    <SmallButton onClick={handleShareButtonClicked} className="bg-grayscale-lightgray">
      <ShareIcon className="fill-grayscale-black" />
      <p className="hidden home:block">{lectureCode}</p>
    </SmallButton>
  );
};

export default HeaderCodeCopyButton;
