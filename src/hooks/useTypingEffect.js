import { useState, useEffect } from 'react';

const useTypingEffect = (texts, typeSpeed = 100, pauseTime = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : typeSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, texts, typeSpeed, pauseTime]);

  return displayText;
};

export default useTypingEffect;

