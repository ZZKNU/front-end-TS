import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Search from "./Search";
import FortuneModal from "../Modals/FortuneModal";
import MessageModal from "../Forms/MessageForm";
import { useAuthStore } from "../../store";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavLinkProps {
  to: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState(false);
  const { accessToken, clearAuth } = useAuthStore();

  const toggleMessageModal = () => setIsMessageModalOpen(!isMessageModalOpen);
  const toggleFortuneModal = () => setIsFortuneModalOpen(!isFortuneModalOpen);

  const sidebarAnimation = {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  };

  const renderNavLinks = () => {
    const links = [
      { to: "/", text: "홈" },
      ...(accessToken
        ? [
            { to: "/alllist", text: "전체 게시글" },
            { to: "/create", text: "글쓰기" },
            { to: "/my", text: "마이페이지" },
            { to: "/messagelist", text: "쪽지" },
            {
              to: "/",
              text: "로그아웃",
              onClick: () => {
                clearAuth();
                toggleSidebar();
              },
            },
            {
              to: "#",
              text: "운세 보기",
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                toggleFortuneModal();
              },
            },
          ]
        : [{ to: "/login", text: "로그인" }]),
    ];

    return links.map((link, index) => (
      <NavLink key={index} to={link.to} onClick={link.onClick || toggleSidebar}>
        {link.text}
      </NavLink>
    ));
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...sidebarAnimation}
            className="fixed top-0 left-0 h-full bg-gradient-to-b from-amber-100 to-amber-200 w-64 z-40 flex flex-col p-4 shadow-lg"
          >
            <SidebarHeader toggleSidebar={toggleSidebar} />
            <div className="flex flex-col gap-4">
              {accessToken && <Search />}
              {renderNavLinks()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && <SidebarToggleButton toggleSidebar={toggleSidebar} />}

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={toggleMessageModal}
        onSendMessage={(messageData: any) => {
          console.log("Sending message:", messageData);
          toggleMessageModal();
        }}
        userId={0}
      />

      <FortuneModal isOpen={isFortuneModalOpen} onClose={toggleFortuneModal} />
    </>
  );
};

const SidebarHeader: React.FC<{ toggleSidebar: () => void }> = ({
  toggleSidebar,
}) => (
  <div className="flex justify-between items-center mb-8">
    <Link
      to="/"
      className="text-2xl font-bold tracking-wider no-underline text-amber-800"
    >
      Pooguel
    </Link>
    <button
      onClick={toggleSidebar}
      className="text-amber-700 hover:text-amber-900 transition-colors duration-300"
    >
      <FaTimes size={24} />
    </button>
  </div>
);

const SidebarToggleButton: React.FC<{ toggleSidebar: () => void }> = ({
  toggleSidebar,
}) => (
  <button
    onClick={toggleSidebar}
    className="fixed top-4 left-4 z-50 text-amber-800 bg-amber-100 p-2 rounded-full shadow-md hover:bg-amber-200 transition-colors duration-300"
  >
    <FaBars size={24} />
  </button>
);

const NavLink: React.FC<NavLinkProps> = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="no-underline text-base relative text-amber-700 transition-all duration-300 ease-in-out hover:text-amber-900 group"
  >
    {children}
    <span className="absolute w-0 h-0.5 bg-amber-500 bottom-[-5px] left-0 transition-all duration-300 ease-in-out group-hover:w-full"></span>
  </Link>
);

export default Sidebar;
