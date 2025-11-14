import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import styles from "../styles/ResumeUploader.module.scss";

interface ResumeUploaderProps {
  onUpload?: (file: File) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onUpload?.(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onUpload?.(file);
    }
  };

  return (
    <motion.div
      className={`${styles.uploader} ${isDragging ? styles.dragging : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
    >
      <UploadCloud size={48} className={styles.icon} />
      <p>{fileName ? `Uploaded: ${fileName}` : "Drag & drop a resume here, or click to upload"}</p>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className={styles.fileInput}
      />
    </motion.div>
  );
};
