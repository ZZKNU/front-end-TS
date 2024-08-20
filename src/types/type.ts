export interface UserInfo {
  id: number;
  nickname: string;
  email: string;
  birthdate: string;
  authority: string;
}

export interface LikeItem {
  id: number;
  title: string;
  content: string;
  author: string;
}

export interface MenuItemProp {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

export interface LikeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  likeList: LikeItem[];
}

export interface Friend {
  id: number;
  email: string;
  nickName: string;
  birthDate: string;
}

export interface FriendListProps {
  onFriendSelect: (friend: Friend) => void;
  showUnfollowButton: boolean;
}

export interface AdminPost {
  id: number;
  title: string;
  category: string;
  status: "PENDING" | "ACCEPT" | "REJECT";
  type: string;
  content: string;
  author: string;
  certified: boolean;
  liked: number;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  birthdate: string;
  authority: "USER" | "AUTHOR" | "ADMIN";
}

export interface Post {
  id: number;
  title: string;
  createdAt: string;
  author: string;
  nickname: string;
  content: string;
  isLiked: boolean;
}

export interface Message {
  id: number;
  message_title: string;
  sender_nickName: string;
  receiver_nickName: string;
  createdAt: string;
  read: boolean;
}

export interface FollowListResponse {
  content: Friend[];
  totalPages: number;
  last: boolean;
}
