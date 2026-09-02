import { useCallback, useRef } from "react";

export default function useFocusEnd() {
  const inputRef = useRef(null);

  const setFocusToEnd = useCallback(() => {
    if (inputRef.current) {
      setTimeout(() => {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
        inputRef.current.scrollLeft = inputRef.current.scrollWidth;
      }, 0);
    }
  }, []);

  return [inputRef, setFocusToEnd];
}
