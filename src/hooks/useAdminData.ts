import { getUserList, possiblePromoteList } from "../apis/api";
import { useState, useEffect } from "react";
import { Post, UserInfo } from "types/type";

const useAdminData = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [promotablePosts, setPromotablePosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userList, promoteList] = await Promise.all([
          getUserList(),
          possiblePromoteList(),
        ]);

        setUsers(userList.data);
        setPromotablePosts(promoteList.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return {
    posts,
    setPosts,
    users,
    setUsers,
    promotablePosts,
    setPromotablePosts,
  };
};

export default useAdminData;
