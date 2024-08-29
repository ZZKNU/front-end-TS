import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../apis/api";
import { useUserInfo } from "../hooks/useUserInfo";
import { useAuthStore } from "../store";

const ChangePwPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { data: userInfo } = useUserInfo();

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setResult("비밀번호가 성공적으로 변경되었습니다.");
      clearAuth();
      sessionStorage.clear();
      navigate("/login");
    },
    onError: (error) => {
      setResult(`오류가 발생했습니다: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (newPassword !== confirmPassword) {
      setResult("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (userInfo?.email) {
      changePasswordMutation.mutate({
        email: userInfo.email,
        oldPassword,
        newPassword,
      });
    } else {
      setResult("사용자 정보를 불러올 수 없습니다.");
    }
  };

  const inputStyle =
    "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">
            비밀번호 변경
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className={labelStyle}>
                현재 비밀번호
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력해주세요"
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className={labelStyle}>
                새 비밀번호
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력해주세요"
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelStyle}>
                새 비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호를 다시 입력해주세요"
                className={inputStyle}
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              비밀번호 변경
            </motion.button>
          </form>

          {result && (
            <p className="mt-4 text-center text-sm text-amber-600">{result}</p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link
              to="/mypage"
              className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
            >
              마이페이지로 돌아가기
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePwPage;
