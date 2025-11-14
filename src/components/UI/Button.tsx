import type { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "../../styles/UI.module.scss";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button: FC<ButtonProps> = ({ children, onClick, type = "button", className }) => (
  <motion.button
    type={type}
    onClick={onClick}
    className={`${styles.button} ${className || ""}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);
