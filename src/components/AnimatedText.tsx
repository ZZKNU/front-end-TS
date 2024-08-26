import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ children, className }) => {
  const { scrollYProgress } = useScroll();
  const fontSize = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <motion.div
      className={className}
      style={{ scale: fontSize }}
      //   whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedText;
