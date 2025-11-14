import type { FC, ReactNode, MouseEvent } from "react";
import { motion } from "framer-motion";
import styles from "../../styles/UI.module.scss";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <motion.div
        className={styles.modalContent}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
