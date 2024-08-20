import { useQuery } from "@tanstack/react-query";
import { getUserLike } from "../apis/api";
import { LikeItem } from "../types/type";

export const useLikeList = (enabled: boolean) => {
  return useQuery<LikeItem[], Error>({
    queryKey: ["userLikes"],
    queryFn: getUserLike,
    enabled,
  });
};
