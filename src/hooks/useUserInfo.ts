import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../apis/api";
import { UserInfo } from "../types/type";

export const useUserInfo = () => {
  return useQuery<UserInfo, Error>({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });
};
