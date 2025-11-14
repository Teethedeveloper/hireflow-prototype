import type { FC } from "react";
import { motion } from "framer-motion";
import { Home, Users, Upload, Cpu, Settings } from "lucide-react";
import "../styles/components.scss";

export const Sidebar: FC = () => {
  const menu = [
    { label: "Dashboard", icon: Home },
    { label: "Candidates", icon: Users },
    { label: "Upload Resume", icon: Upload },
    { label: "AI Interview", icon: Cpu },
    { label: "Settings", icon: Settings },
  ];

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ul>
        {menu.map((item) => (
          <li key={item.label} className="sidebar__item">
            <item.icon size={18} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
};
