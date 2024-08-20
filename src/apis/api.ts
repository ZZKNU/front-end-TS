import axiosInstance from "./axiosInstance";
import { useAuthStore } from "../store";
import { Friend, UserInfo } from "types/type";

/**
 * 로그인
 */
export const getLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  const { accessToken } = response.data;
  useAuthStore.getState().setTokens(accessToken);
  return { data: response.data };
};

/**
 * 회원가입
 */
export const getJoin = async ({
  email,
  password,
  nickname,
  birthdate,
  phone,
  name,
}: {
  email: string;
  password: string;
  nickname: string;
  birthdate: string;
  phone: string;
  name: string;
}) => {
  const response = await axiosInstance.post("/auth/join", {
    email,
    password,
    nickname,
    birthdate,
    phone,
    name,
  });
  const { accessToken } = response.data;
  useAuthStore.getState().setTokens(accessToken);
  return { data: response.data };
};

/**
 * 닉네임 중복체크
 */
export const getCheckNickname = async ({ nickname }: { nickname: string }) => {
  const response = await axiosInstance.get(`/auth/nickname/${nickname}`, {
    params: { nickname },
  });
  return response.data;
};

/**
 * 이메일 중복체크
 */
export const getCheckEmail = async ({ email }: { email: string }) => {
  const response = await axiosInstance.get(`/auth/email/${email}`, {
    params: {
      email,
    },
  });
  return response.data;
};

/**
 * 회원탈퇴
 */
export const deleteUser = async () => {
  const response = await axiosInstance.delete(`/users`);
  return response.data;
};

/**
 * 비밀번호 재발급
 */
export const renewPassword = async ({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) => {
  const response = await axiosInstance.post("/auth/find/pw", {
    name,
    email,
    phone,
  });
  return response.data;
};

/**
 * 아이디 찾기
 */
export const findId = async ({
  name,
  phone,
}: {
  name: string;
  phone: string;
}) => {
  const response = await axiosInstance.post("/auth/find/id", {
    name,
    phone,
  });
  return response.data;
};

/**
 * 비밀번호 변경
 */
export const changePassword = async ({
  email,
  oldPassword,
  newPassword,
}: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const response = await axiosInstance.post("/auth/change/pw", {
    email,
    oldPassword,
    newPassword,
  });
  return response.data;
};
/**
 * 베스트 도전 목록에서 글 작성
 */
export const writeBestQuote = async ({
  title,
  quoteType,
  content,
  author,
}: {
  title: string;
  quoteType: string;
  content: string;
  author: string;
}) => {
  const response = await axiosInstance.post("/challenges", {
    title,
    quoteType,
    content,
    author,
  });
  return { data: response.data };
};

/**
 * 베스트 도전에서 작성한 글 수정
 */
export const editBestQuote = async ({
  id,
  title,
  quoteType,
  content,
  author,
}: {
  id: number;
  title: string;
  quoteType: string;
  content: string;
  author: string;
}) => {
  const response = await axiosInstance.put("/challenges", {
    id,
    title,
    quoteType,
    content,
    author,
  });
  return response.data;
};

/**
 * 베스트 도전 글 조회
 */
export const getBestQuoteList = async ({
  page = 0,
  size = 20,
}: {
  page?: number;
  size?: number;
}) => {
  const response = await axiosInstance.get("/challenges", {
    params: {
      page,
      size,
    },
  });
  return { data: response.data };
};

/**
 * 베스트 도전 좋아요 요청
 */
export const likeBestQuote = async ({ id }: { id: number }) => {
  const response = await axiosInstance.put(`/challenges/${id}`);
  return response.data;
};

/**
 * 베스트 도전 quote_id를 가진 글 조회
 */
export const getBestQuoteDetail = async ({
  quote_id,
}: {
  quote_id: number;
}) => {
  const response = await axiosInstance.get(`/challenges/${quote_id}`);
  return response.data;
};

/**
 * 베스트 도전 quote_id를 가진 글 삭제
 */
export const deleteQuote = async ({ quote_id }: { quote_id: number }) => {
  const response = await axiosInstance.delete(`/challenges/${quote_id}`);
  return response.data;
};

/**
 * 베스트 도전 / 일반 글귀에서 type과 title로 검색
 */
export const searchQuote = async ({ author }: { author: string }) => {
  const response = await axiosInstance.get(
    `/challenges/search?author=${author}`
  );
  return response.data;
};

/**
 * 모든 일반 글귀 조회
 */
export const getAllQuoteList = async ({
  page = 0,
  size = 20,
}: {
  page?: number;
  size?: number;
}) => {
  const response = await axiosInstance.get("/quotes", {
    params: {
      page,
      size,
    },
  });
  return { data: response.data };
};

/**
 * 일반 글귀 중 quote_id를 가진 글 조회
 */
export const getQuoteDetail = async ({ quote_id }: { quote_id: number }) => {
  const response = await axiosInstance.get(`/quotes/${quote_id}`);
  return response.data;
};

/**
 * 일반 글귀 좋아요 요청
 */
export const likeNormalQuote = async ({ id }: { id: number }) => {
  const response = await axiosInstance.put(`/quotes/${id}`);
  return response.data;
};

// 일반 글귀 검색 , 검색 하나로 만들고 type에 따라 결과를 다르게?
// export const searchNormalQuote = async (type, title) => {
//   const response = await axiosInstance.get("/quotes/search", { type, title });
//   return response.data;
// };

/**
 * 회원의 마이 페이지 조회
 */
export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get(`/users`);
  const userData = response.data;
  const userInfo: UserInfo = {
    id: userData.id,
    nickname: userData.nickname,
    email: userData.email,
    birthdate: userData.birthdate,
    authority: userData.authority,
  };

  return userInfo;
};

/**
 * 회원의 개인정보 수정
 */
export const updateUserInfo = async ({
  nickName,
  birthDate,
}: {
  nickName: string;
  birthDate?: string;
}) => {
  const response = await axiosInstance.put(`/users`, {
    nickName,
    birthDate,
  });
  return response.data;
};

// 운세?
// todo

/**
 * 유저가 좋아요한 글 목록
 */
export const getUserLike = async () => {
  const response = await axiosInstance.get("/users/liked");
  return response.data;
};

/**
 * 특정 name을 가진 친구 검색
 */
export const searchFriends = async ({
  name,
  page = 0,
  size = 20,
}: {
  name: string;
  page?: number;
  size?: number;
}) => {
  const response = await axiosInstance.get(`/friends/search/${name}`, {
    params: {
      page,
      size,
    },
  });
  return { data: response.data };
};

/**
 * friend_id를 가진 친구에게 추가 요청
 */
export const addFriends = async ({ friend_id }: { friend_id: number }) => {
  const response = await axiosInstance.post(`/friends/${friend_id}`, null, {
    params: {
      friend_id,
    },
  });
  return response.data;
};

/**
 * 유저(나)가 팔로우한 친구를 조회
 */
export const getFollowList = async ({
  page = 0,
  size = 20,
}: {
  page?: number;
  size?: number;
}): Promise<Friend[]> => {
  const response = await axiosInstance.get(`/friends/follow`, {
    params: {
      page,
      size,
    },
  });
  const followList = response.data;

  return followList.map((follower: Friend) => ({
    id: follower.id,
    email: follower.email,
    nickName: follower.nickName,
    birthDate: follower.birthDate,
  }));
};

/**
 * 유저(나)를 팔로워한 친구를 조회
 */
export const getFollowerList = async ({
  page = 0,
  size = 20,
}: {
  page?: number;
  size?: number;
}): Promise<Friend[]> => {
  const response = await axiosInstance.get(`/friends/follower`, {
    params: {
      page,
      size,
    },
  });
  const followerList = response.data;

  return followerList.map((follower: Friend) => ({
    id: follower.id,
    email: follower.email,
    nickName: follower.nickName,
    birthDate: follower.birthDate,
  }));
};

/**
 * 친구 목록에서 특정 친구 삭제
 */
export const deleteFriends = async ({ id }: { id: number }) => {
  const response = await axiosInstance.delete(`/friends/${id}`);
  return response.data;
};

/**
 * 메세지 전송
 */
export const postMessage = async ({
  to_id,
  quote_id,
  title,
}: {
  to_id: number;
  quote_id: number;
  title: string;
}) => {
  const response = await axiosInstance.post(`/messages/${to_id}`, {
    quote_id: quote_id,
    title: title,
  });
  return response.data;
};

/**
 * 내가 받은 메세지 조회
 */
export const getReceiveMessage = async () => {
  const response = await axiosInstance.get(`/messages/receive`);
  return { data: response.data };
};

/**
 * 내가 보낸 메세지 조회
 */
export const getPostMessage = async () => {
  const response = await axiosInstance.get(`/messages/post`);
  return { data: response.data };
};

/**
 * 특정 메세지 조회
 */
export const getSpecificMessage = async ({
  message_id,
}: {
  message_id: number;
}) => {
  const response = await axiosInstance.get(`/messages/${message_id}`);
  return response.data;
};

/**
 * 메세지 삭제
 */
export const deleteMessage = async ({ message_id }: { message_id: number }) => {
  const response = await axiosInstance.delete(`/messages/${message_id}`);
  return response.data;
};

/**
 * 베스트 도전 글을 일반 글로 승격
 */
export const promoteQuote = async ({
  quote_id,
  pos,
}: {
  quote_id: number;
  pos: boolean;
}) => {
  const response = await axiosInstance.put(
    `/admin/promotion/${quote_id}`,
    JSON.stringify(pos),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * 일반 유저를 관리자로 승격
 */
export const authorityUser = async ({
  user_id,
  auth,
}: {
  user_id: number;
  auth: string;
}) => {
  const response = await axiosInstance.put(
    `/admin/authority/${user_id}`,
    JSON.stringify(auth),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**
 * 존재하는 사용자의 목록 가져오기
 */
export const getUserList = async () => {
  const response = await axiosInstance.get(`/admin/userList`);
  return { data: response.data };
};

/**
 * 승격 가능한 글 목록 가져오기
 */
export const possiblePromoteList = async () => {
  const response = await axiosInstance.get(`/admin/challenges`);
  return { data: response.data };
};
