import { useEffect, useRef } from "react";

const usePortal = (id: string) => {
  const rootElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let parentElement = document.querySelector(`#${id}`) as HTMLElement | null;

    // id가 있는 element가 없으면 새로 생성
    if (!parentElement) {
      parentElement = document.createElement("div");
      parentElement.setAttribute("id", id);
      document.body.appendChild(parentElement);
    }

    rootElementRef.current = parentElement;

    return () => {
      if (parentElement && !parentElement.childElementCount) {
        parentElement.remove();
      }
    };
  }, [id]);

  return rootElementRef.current;
};

export default usePortal;
