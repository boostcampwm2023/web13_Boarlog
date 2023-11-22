import { useEffect, useRef } from "react";

const usePortal = (id: string) => {
  const rootElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const existingParent = document.querySelector(`#${id}`) as HTMLElement | null;
    const parentElement = existingParent || createRootElement(id);

    if (!existingParent && parentElement) addRootElement(parentElement);
    if (rootElementRef.current) parentElement.appendChild(rootElementRef.current);

    return () => {
      if (rootElementRef.current) {
        rootElementRef.current.remove();
        if (parentElement && !parentElement.childElementCount) parentElement.remove();
      }
    };
  }, [id]);

  // toast를 위한 새로운 root element 생성
  const createRootElement = (id: string) => {
    const rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", id);
    return rootContainer;
  };

  // 생성한 root element를 body 뒤에 삽입
  const addRootElement = (rootElement: HTMLElement) => {
    document.body.appendChild(rootElement);
  };

  // toast를 내부에 담을 root element 생성
  const getRootElement = () => {
    if (!rootElementRef.current) rootElementRef.current = document.createElement("div");
    return rootElementRef.current;
  };

  return getRootElement();
};

export default usePortal;
