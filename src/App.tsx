import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, lazy } from "react";
import LoginPage from "./page/LoginPage";
import JoinPage from "./page/JoinPage";
import Sidebar from "./components/UI/Sidebar";
import MainPage from "./page/MainPage";
import CreatePage from "./page/CreatePage";
import AllListPage from "./page/AllListPage";
import BestListPage from "./page/BestListPage";
import MyPage from "./page/MyPage";
import ShowPage from "./page/ShowPage";
import EditPage from "./page/EditPage";
import MessagePage from "./page/MessagePage";
import MessageDetailPage from "./page/MessageDetailPage";

const FindPage = lazy(() => import("./page/FindPage"));
const ChangePwPage = lazy(() => import("./page/ChangePwPage"));
const AdminPage = lazy(() => import("./page/AdminPage"));

function App() {
  // 사이드바 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <BrowserRouter>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<JoinPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/alllist" element={<AllListPage />} />
            <Route path="/bestlist" element={<BestListPage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/list/:id" element={<ShowPage />}>
              <Route path="edit" element={<EditPage />} />
            </Route>
            <Route path="/messagelist" element={<MessagePage />}>
              <Route path=":id" element={<MessageDetailPage />} />
            </Route>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/find" element={<FindPage />} />
            <Route path="/change-password" element={<ChangePwPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
