import type { FC } from "react";
import { motion } from "framer-motion";
import { UserCircle2, Bell, Search } from "lucide-react";
import "../styles/components.scss";

export const Navbar: FC = () => {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar__left">
        <h1 className="navbar__logo">HireFlow</h1>
      </div>

      <div className="navbar__right">
        <Search className="icon" />
        <Bell className="icon" />
        <UserCircle2 className="icon" />
      </div>
    </motion.nav>
  );
};
