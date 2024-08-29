import React from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiFileText } from "react-icons/fi";
import { promoteQuote, authorityUser } from "../apis/api";
import { AdminPost, UserInfo } from "types/type";
import useAdminData from "../hooks/useAdminData";

enum Status {
  PENDING = "PENDING",
  ACCEPT = "ACCEPT",
  REJECT = "REJECT",
}

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const styles = {
    [Status.PENDING]: "bg-yellow-200 text-yellow-800",
    [Status.ACCEPT]: "bg-green-200 text-green-800",
    [Status.REJECT]: "bg-red-200 text-red-800",
  };
  const icons = {
    [Status.PENDING]: <FiClock className="inline mr-1" />,
    [Status.ACCEPT]: <FiCheckCircle className="inline mr-1" />,
    [Status.REJECT]: <FiXCircle className="inline mr-1" />,
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

const Table: React.FC<{
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}> = ({ headers, data, renderRow }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map(renderRow)}
      </tbody>
    </table>
  </div>
);

const SummaryCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
}> = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center">
      {icon}
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const AdminPage: React.FC = () => {
  const {
    posts,
    setPosts,
    users,
    setUsers,
    promotablePosts,
    setPromotablePosts,
  } = useAdminData();

  const handleStatusChange = (id: number, newStatus: Status) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, status: newStatus } : post
      )
    );
  };

  const handlePromoteQuote = async (id: number) => {
    try {
      await promoteQuote({ quote_id: id, pos: true });
      setPromotablePosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== id)
      );
    } catch (error) {
      console.error(`Failed to promote quote ${id}`, error);
    }
  };

  const handleAuthorityChange = async (
    id: number,
    newAuthority: UserInfo["authority"]
  ) => {
    try {
      await authorityUser({ user_id: id, auth: newAuthority });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, authority: newAuthority } : user
        )
      );
    } catch (error) {
      console.error(`Failed to change authority for user ${id}`, error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">베스트 도전 관리자 대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        <SummaryCard
          icon={<FiFileText className="text-blue-500 text-3xl mr-2" />}
          title="총 게시물"
          value={promotablePosts.length}
        />
        <SummaryCard
          icon={<FiCheckCircle className="text-green-500 text-3xl mr-2" />}
          title="사용자 수"
          value={users.length}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <h2 className="text-2xl font-bold mt-2 ml-2">✅ 카테고리 수정</h2>
        <Table
          headers={["ID", "제목", "카테고리", "상태", "작업"]}
          data={posts}
          renderRow={(post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 whitespace-nowrap">{post.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{post.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={post.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleStatusChange(post.id, Status.ACCEPT)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                  disabled={post.status === Status.ACCEPT}
                >
                  수락
                </button>
                <button
                  onClick={() => handleStatusChange(post.id, Status.REJECT)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  disabled={post.status === Status.REJECT}
                >
                  거절
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <h2 className="text-2xl font-bold mt-2 ml-2">✅ 승격 가능한 글 목록</h2>
        <Table
          headers={[
            "ID",
            "제목",
            "유형",
            "내용",
            "글쓴이",
            "인증됨",
            "좋아요",
            "작업",
          ]}
          data={promotablePosts}
          renderRow={(post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 whitespace-nowrap">{post.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{post.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{post.content}</td>
              <td className="px-6 py-4 whitespace-nowrap">{post.author}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {post.certified ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{post.liked}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handlePromoteQuote(post.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  승격
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-2xl font-bold mt-2 ml-2">✅ 사용자 목록</h2>
        <Table
          headers={["ID", "이메일", "닉네임", "생년월일", "권한"]}
          data={users}
          renderRow={(user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.nickname}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.birthdate}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.authority}
                  onChange={(e) =>
                    handleAuthorityChange(
                      user.id,
                      e.target.value as UserInfo["authority"]
                    )
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="USER">USER</option>
                  <option value="AUTHOR">AUTHOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default AdminPage;
