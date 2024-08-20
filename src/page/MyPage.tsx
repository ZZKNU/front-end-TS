import React, { useState } from "react";
import {
  FaHeart,
  FaUserFriends,
  FaCog,
  FaPencilAlt,
  FaComments,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, updateUserInfo } from "../apis/api";
import { useAuthStore } from "../store";
import Modal from "../components/Modals/Modal";
import AdminPage from "./AdminPage";
import FriendList from "../components/Lists/FriendList";
import MenuItem from "../components/MenuItem";
import LikeListModal from "../components/Modals/LikeListModal";
import { useUserInfo } from "../hooks/useUserInfo";
import { useLikeList } from "../hooks/useLikeList";
import { Friend, MenuItemProp } from "../types/type";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [selectFriend, setSelectFriend] = useState<Friend>();
  const { data: userInfo, isLoading, error } = useUserInfo();
  const { data: likeList = [] } = useLikeList(isLikeModalOpen);

  const updateNicknameMutation = useMutation({
    mutationFn: (newNickname: string) =>
      updateUserInfo({ nickName: newNickname, birthDate: userInfo?.birthdate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setIsModalOpen(false);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      clearAuth();
      navigate("/");
    },
  });

  if (isLoading) return <div className="text-center py-8">로딩 중...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        사용자 정보를 불러오는데 실패했습니다: {error.message}
      </div>
    );
  if (userInfo?.authority === "ADMIN") return <AdminPage />;

  const handleMenuClick = (item: string) => {
    if (item === "친구") setIsFriendsModalOpen(true);
    else if (item === "좋아요") setIsLikeModalOpen(true);
    else if (item === "메시지함") navigate("/messagelist");
    else if (item === "회원탈퇴") {
      if (window.confirm("회원 탈퇴를 하시겠습니까?")) {
        deleteUserMutation.mutate();
      }
    } else if (item === "비밀번호 변경") {
      navigate("/change-password");
    }
  };
  const handleFriendSelect = (friend: Friend) => {
    setSelectFriend(friend);
  };

  const menuItems: MenuItemProp[] = [
    {
      icon: <FaHeart className="text-gray-600" />,
      text: "좋아요 누른 글",
      onClick: () => handleMenuClick("좋아요"),
    },
    {
      icon: <FaUserFriends className="text-gray-600" />,
      text: "친구 목록",
      onClick: () => handleMenuClick("친구"),
    },
    {
      icon: <FaComments className="text-gray-600" />,
      text: "메시지함",
      onClick: () => handleMenuClick("메시지함"),
    },
    {
      icon: <FaCog className="text-gray-600" />,
      text: "회원탈퇴",
      onClick: () => handleMenuClick("회원탈퇴"),
    },
    {
      icon: <FaEdit className="text-gray-600" />,
      text: "비밀번호 변경",
      onClick: () => handleMenuClick("비밀번호 변경"),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-400 text-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">{userInfo?.nickname}</h1>
                <FaPencilAlt
                  className="ml-2 text-gray-600 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
              <p className="text-sm opacity-80">{userInfo?.email}</p>
              <p className="text-sm opacity-80">
                생년월일: {userInfo?.birthdate}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="닉네임 변경"
      >
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="새 닉네임을 입력하세요"
          className="w-full px-3 py-2 border rounded"
        />
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            onClick={() => updateNicknameMutation.mutate(newNickname)}
            disabled={updateNicknameMutation.isPending}
          >
            {updateNicknameMutation.isPending ? "저장 중..." : "저장"}
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={() => setIsModalOpen(false)}
            disabled={updateNicknameMutation.isPending}
          >
            취소
          </button>
        </div>
        {updateNicknameMutation.isError && (
          <p className="mt-2 text-red-500">
            닉네임 업데이트에 실패했습니다:{" "}
            {updateNicknameMutation.error.message}
          </p>
        )}
      </Modal>

      <Modal
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
        title="친구 목록"
      >
        <FriendList
          onFriendSelect={handleFriendSelect}
          showUnfollowButton={true}
        />
      </Modal>

      <LikeListModal
        isOpen={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        likeList={likeList}
      />
    </div>
  );
};

export default MyPage;
