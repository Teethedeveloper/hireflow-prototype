import type { FC, ReactNode } from "react";
import styles from "../../styles/UI.module.scss";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => (
  <div className={`${styles.card} ${className || ""}`}>
    {children}
  </div>
);
