import { useState, useEffect } from "react";
import Modal from "../Modals/Modal";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFollowList } from "../../apis/api";
import React from "react";
import { Friend } from "types/type";

interface MessageFormProps {
  onSendMessage: (message: { recipient: string; message: string }) => void;
  onClose: () => void;
  initialRecipient?: string;
  userId: number;
}

const MessageForm: React.FC<MessageFormProps> = ({
  onSendMessage,
  onClose,
  initialRecipient = "",
  userId,
}) => {
  const [recipient, setRecipient] = useState<string>(initialRecipient);
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [allFriends, setAllFriends] = useState<Friend[]>([]);

  const { data, isLoading, isPending, isError, error } = useQuery<
    Friend[],
    Error
  >({
    queryKey: ["friends", page],
    queryFn: () => getFollowList({}),
  });

  useEffect(() => {
    if (data) {
      setAllFriends((prevFriends) => {
        const newFriends = data.filter(
          (newFriend: { id: number }) =>
            !prevFriends.some((friend) => friend.id === newFriend.id)
        );
        return [...prevFriends, ...newFriends];
      });
      if (!recipient && data.length > 0) {
        setRecipient(data[0].email);
      }
    }
  }, [data, recipient]);

  const hasMore = data && data.length > 0;

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (recipient && message.trim()) {
      onSendMessage({ recipient, message });
      setRecipient("");
      setMessage("");
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} method="POST" className="space-y-4">
      <div>
        <label
          htmlFor="recipient"
          className="block text-sm font-medium text-gray-700"
        >
          받는 사람
        </label>
        <select
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
          required
        >
          <option value="">친구를 선택하세요</option>
          {status === "pending" ? (
            <option>로딩 중...</option>
          ) : status === "error" ? (
            <option>오류 발생: {error?.message}</option>
          ) : (
            allFriends?.map((friend) => (
              <option key={friend.id} value={friend.email}>
                {friend.nickName}
              </option>
            ))
          )}
        </select>
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          메시지
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        쪽지 보내기
      </button>
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isError || isLoading || isPending}
          className="mt-4 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200"
        >
          {isLoading || isPending ? "로딩 중..." : "더 많은 친구 불러오기"}
        </button>
      )}
    </form>
  );
};

// Define props for MessageModal
interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: { recipient: string; message: string }) => void;
  initialRecipient?: string;
  userId: number;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  initialRecipient,
  userId,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="쪽지 보내기">
      <div className="flex justify-end">
        <Link
          className="bg-amber-600 text-white rounded-full px-3 py-1 hover:bg-amber-700 no-underline"
          to="/messagelist"
          onClick={onClose}
        >
          메시지 목록
        </Link>
      </div>
      <MessageForm
        onSendMessage={onSendMessage}
        onClose={onClose}
        initialRecipient={initialRecipient}
        userId={userId}
      />
    </Modal>
  );
};

export default MessageModal;
