import { useQuery } from "@tanstack/react-query";
import { getBestQuoteList, getAllQuoteList } from "../apis/api";
import { Post } from "types/type";

const ITEMS_PER_PAGE = 6;
const PAGINATION_LIMIT = 3;

const fetchPosts = async (isBest: boolean) => {
  const data = isBest
    ? await getBestQuoteList({ page: 0, size: ITEMS_PER_PAGE * 100 })
    : await getAllQuoteList({ page: 0, size: ITEMS_PER_PAGE * 100 });
  return data.data;
};

export const usePostList = (isBest: boolean) => {
  const {
    data: allPosts = [],
    isLoading,
    error,
  } = useQuery<Post[], Error>({
    queryKey: ["posts", isBest],
    queryFn: () => fetchPosts(isBest),
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  return { allPosts, isLoading, error };
};
