import React, { useRef } from "react";

interface LectureCodeInputProps {
  inputs: string[];
  setInputs: React.Dispatch<React.SetStateAction<string[]>>;
  keyPress: () => void;
}

const LectureCodeInput = ({ inputs, setInputs, keyPress }: LectureCodeInputProps) => {
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

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      keyPress();
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
          onKeyDown={handleKeyDown(index)}
          ref={(element) => (inputRefs.current[index] = element)}
          className="border-black flex-grow w-full rounded-xl text-center align-middle medium-32"
        />
      ))}
    </div>
  );
};

export default LectureCodeInput;
