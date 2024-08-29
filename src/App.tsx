import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, lazy } from "react";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";
import Sidebar from "./components/UI/Sidebar";
import MainPage from "./pages/MainPage";
import CreatePage from "./pages/CreatePage";
import AllListPage from "./pages/AllListPage";
import BestListPage from "./pages/BestListPage";
import MyPage from "./pages/MyPage";
import ShowPage from "./pages/ShowPage";
import EditPage from "./pages/EditPage";
import MessagePage from "./pages/MessagePage";
import MessageDetailPage from "./pages/MessageDetailPage";

const FindPage = lazy(() => import("./pages/FindPage"));
const ChangePwPage = lazy(() => import("./pages/ChangePwPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

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
