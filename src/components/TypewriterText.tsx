import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  typingSpeed?: number;
  className?: string;
}

export function TypewriterText({ 
  text, 
  typingSpeed = 80, 
  className = "" 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [displayedText, text, typingSpeed]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayedText}</span>
      <motion.span
        className="inline-block ml-0.5 font-pixel text-primary cursor-fade"
        style={{ 
          imageRendering: 'pixelated',
          width: '0.6em',
          textAlign: 'center'
        }}
        aria-hidden="true"
      >
        █
      </motion.span>
    </span>
  );
}
