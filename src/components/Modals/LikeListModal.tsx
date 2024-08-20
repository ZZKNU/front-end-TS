import React from "react";
import { useNavigate } from "react-router-dom";
import { LikeItem, LikeListModalProps } from "../../types/type";

const LikeListModal: React.FC<LikeListModalProps> = ({
  isOpen,
  onClose,
  likeList = [],
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full max-h-[80%] overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          내가 좋아하는 글들
        </h2>
        <ul className="container flex flex-col items-center space-y-3">
          {likeList.map((item) => (
            <li
              key={item.id}
              className="w-full max-w-[90%] p-4 border rounded-lg transition duration-300 hover:bg-gray-100 cursor-pointer text-center mx-auto"
              onClick={() => {
                navigate(`/list/${item.id}`);
                onClose();
              }}
            >
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-700">{item.content}</p>
              <span className="text-sm text-gray-500">
                작성자: {item.author}
              </span>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full px-4 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-500 transition"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default LikeListModal;
