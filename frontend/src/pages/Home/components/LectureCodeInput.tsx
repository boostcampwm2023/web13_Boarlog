import React, { useRef } from "react";

interface LectureCodeInputProps {
  inputs: string[];
  setInputs: React.Dispatch<React.SetStateAction<string[]>>;
}

const LectureCodeInput = ({ inputs, setInputs }: LectureCodeInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^[0-9]$/i.test(value)) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      if (value && index < inputs.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 백스페이스 입력 시 이전 필드로 이동
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full h-16 flex flex-row justify-between gap-2 mt-2">
      {inputs.map((value, index) => (
        <input
          key={index}
          type="string"
          maxLength={1}
          value={value}
          onChange={handleChange(index)}
          onKeyDown={handleBackspace(index)}
          ref={(element) => (inputRefs.current[index] = element)}
          className="border-black flex-grow w-full rounded-xl text-center align-middle medium-32" // Tailwind CSS 클래스 또는 다른 CSS 클래스
        />
      ))}
    </div>
  );
};

export default LectureCodeInput;
