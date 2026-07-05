import { useEffect, useState } from 'react';

/**
 * TypeWriter — types out `text` one character at a time, then leaves a
 * permanently blinking cursor. If `words` is supplied instead, it cycles
 * through them (type -> pause -> delete -> next).
 */
const TypeWriter = ({
  text,
  words,
  speed = 45,
  deleteSpeed = 28,
  pause = 1800,
  className = '',
  cursorClassName = '',
  loop = true,
}) => {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState(false);

  const list = words && words.length ? words : text ? [text] : [''];

  useEffect(() => {
    const current = list[wordIndex % list.length];

    if (!words && !loop) {
      // Single static text, just type once
      if (display.length < current.length) {
        const t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), speed);
        return () => clearTimeout(t);
      }
      setDone(true);
      return;
    }

    if (!deleting && display.length < current.length) {
      const t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), speed);
      return () => clearTimeout(t);
    }
    if (!deleting && display.length === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && display.length > 0) {
      const t = setTimeout(() => setDisplay(current.slice(0, display.length - 1)), deleteSpeed);
      return () => clearTimeout(t);
    }
    if (deleting && display.length === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % list.length);
    }
  }, [display, deleting, wordIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={className}>
      {display}
      <span className={`blink-cursor ${cursorClassName}`} aria-hidden="true" />
    </span>
  );
};

export default TypeWriter;
