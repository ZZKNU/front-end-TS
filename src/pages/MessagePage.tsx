import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiEdit } from "react-icons/fi";
import { getUserInfo, getReceiveMessage, getPostMessage } from "../apis/api";
import MessageModal from "../components/Forms/MessageForm";
import { Message, UserInfo } from "types/type";

const MessageListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [user, setUser] = useState<UserInfo>();
  const navigate = useNavigate();
  const [receiveMessage, setReceiveMessage] = useState<Message[]>([]);
  const [sendMessage, setSendMessage] = useState<Message[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    getUser();
    fetchReceiveMessage();
    fetchSendMessage();
  }, []);

  const getUser = async () => {
    try {
      const res = await getUserInfo();
      setUser(res);
    } catch (e) {
      alert(e);
    }
  };

  const fetchReceiveMessage = async (): Promise<void> => {
    try {
      const res = await getReceiveMessage();
      setReceiveMessage(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSendMessage = async (): Promise<void> => {
    try {
      const res = await getPostMessage();
      setSendMessage(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const tabVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  const paginate = (newDirection: number): void => {
    setPage([page + newDirection, newDirection]);
    setActiveTab(activeTab === "received" ? "sent" : "received");
  };

  const openModal = (): void => {
    setSelectedMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleSendMessage = (data: any): void => {
    console.log(data);
    closeModal();
  };

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      className="flex justify-between items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-150"
      onClick={() => navigate(`/message/${message.id}`)}
    >
      <div className="flex-1">
        <p
          className={`font-semibold ${
            !message.read ? "text-blue-600" : "text-gray-700"
          }`}
        >
          {message.message_title}
        </p>
        <div className="flex items-center text-gray-500 text-sm">
          <p className="mr-1 truncate max-w-[200px]">
            {activeTab === "received"
              ? message.sender_nickName
              : message.receiver_nickName}
          </p>
          <p>· {new Date(message.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center">
        {!message.read && activeTab === "received" && (
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        )}
        <FiChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-md bg-white min-h-screen flex flex-col">
      <div className="border-b p-4 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <FiChevronLeft
            className="h-6 w-6 mr-2 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl font-semibold">메시지함</h1>
        </div>
        <FiEdit
          className="h-6 w-6 cursor-pointer"
          onClick={() => openModal()}
        />
      </div>

      <div className="flex border-b sticky top-14 bg-white z-10">
        <button
          className={`flex-1 py-2 px-4 text-center ${
            activeTab === "received"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => activeTab !== "received" && paginate(-1)}
        >
          받은 메시지
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${
            activeTab === "sent"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => activeTab !== "sent" && paginate(1)}
        >
          보낸 메시지
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="h-full overflow-y-auto"
          >
            {(activeTab === "received" ? receiveMessage : sendMessage).map(
              renderMessage
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSendMessage={handleSendMessage}
        initialRecipient={
          selectedMessage ? selectedMessage.receiver_nickName : ""
        }
        userId={user?.id}
      />
    </div>
  );
};

export default MessageListPage;
