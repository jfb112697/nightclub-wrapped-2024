import { useState, useEffect, RefObject } from "react";

export const useDropdownPosition = (inputRef: RefObject<HTMLInputElement>) => {
  const [showAbove, setShowAbove] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      if (!inputRef.current) return;

      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 200; // approximate max height of dropdown

      setShowAbove(spaceBelow < dropdownHeight);
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    window.addEventListener("scroll", checkPosition);

    return () => {
      window.removeEventListener("resize", checkPosition);
      window.removeEventListener("scroll", checkPosition);
    };
  }, [inputRef]);

  return showAbove;
};
