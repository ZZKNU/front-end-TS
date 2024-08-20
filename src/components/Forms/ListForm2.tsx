import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../UI/LoadingSpinner";
import RenderList from "../Lists/RenderList";
import Pagination from "../Pagination";
import { usePagination } from "../../hooks/usePagination";
import { usePostList } from "../../hooks/usePostList";
import {
  getAllQuoteList,
  getBestQuoteDetail,
  getBestQuoteList,
} from "../../apis/api";

const ITEMS_PER_PAGE = 6;

const ListForm2 = ({ isBest = false, name = "" }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [searchText, setSearchText] = useState<string>(
    searchParams.get("search") || ""
  );

  const { allPosts, isLoading, error } = usePostList(isBest);

  const { currentPage, numberOfPages, setCurrentPage, setNumberOfPosts } =
    usePagination(ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage, setCurrentPage]);

  const filteredPosts = useMemo(
    () =>
      allPosts.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
      ),
    [allPosts, searchText]
  );

  useEffect(() => {
    setNumberOfPosts(filteredPosts.length);
  }, [filteredPosts, setNumberOfPosts]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      setSearchParams({ page: page.toString(), search: searchText });

      const nextPage = page + 1;
      if (nextPage <= numberOfPages) {
        queryClient.prefetchQuery({
          queryKey: ["posts", isBest, nextPage],
          queryFn: () =>
            isBest
              ? getBestQuoteList({ page: nextPage - 1, size: ITEMS_PER_PAGE })
              : getAllQuoteList({ page: nextPage - 1, size: ITEMS_PER_PAGE }),
        });
      }
    },
    [
      setCurrentPage,
      setSearchParams,
      searchText,
      numberOfPages,
      queryClient,
      isBest,
    ]
  );

  const handlePostClick = useCallback(
    (quote_id: number) => {
      queryClient.prefetchQuery({
        queryKey: ["post", quote_id],
        queryFn: () => getBestQuoteDetail({ quote_id }),
      });
      navigate(`/list/${quote_id}`);
    },
    [queryClient, navigate]
  );

  const onSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setSearchParams({ page: "1", search: searchText });
        setCurrentPage(1);
        queryClient.invalidateQueries({ queryKey: ["posts", isBest] });
      }
    },
    [setSearchParams, searchText, setCurrentPage, queryClient, isBest]
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center mb-4">
        <Link to="/alllist" className="btn btn-outline-primary mx-2">
          전체
        </Link>
        <Link to="/bestlist" className="btn btn-outline-primary mx-2">
          베스트 도전
        </Link>
      </div>
      <h1 className="mb-4">{name}</h1>
      <input
        type="text"
        placeholder="Search.."
        className="form-control"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyUp={onSearch}
      />
      <hr />
      {!filteredPosts.length ? (
        <div>No posts found</div>
      ) : (
        <>
          <RenderList
            posts={filteredPosts.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )}
            onClick={handlePostClick}
          />
          {numberOfPages > 1 && (
            <Pagination
              currentPage={currentPage}
              numberOfPages={numberOfPages}
              onClick={handlePageChange}
              limit={3}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ListForm2;
