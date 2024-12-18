import { useEffect, useRef } from "react";

/**
 * A custom debounce hook that delays the execution of a function until after a specified delay.
 *
 * @param callback - The function to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns A debounced version of the callback function.
 */
function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = (...args: Parameters<T>) => {
    // Clear the previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

export default useDebounce;
