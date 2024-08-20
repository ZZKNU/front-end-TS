import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { renewPassword, findId } from "../apis/api";

const FindPage: React.FC = () => {
  const [mode, setMode] = useState<"id" | "password">("id");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const clearInput = () => {
    setName("");
    setPhone("");
    setEmail("");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    try {
      if (mode === "id") {
        const data = await findId({ name, phone });
        setResult(`찾은 아이디: ${data}`);
        clearInput();
      } else {
        const data = await renewPassword({ name, phone, email });
        setResult(`비밀번호 : ${data}`);
        clearInput();
      }
    } catch (error) {
      setResult("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const inputStyle =
    "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">
            {mode === "id" ? "아이디 찾기" : "비밀번호 찾기"}
          </h2>

          <div className="mb-6 flex space-x-4">
            {["id", "password"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as "id" | "password")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {m === "id" ? "아이디 찾기" : "비밀번호 찾기"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "id" ? (
              <>
                <div>
                  <label htmlFor="name" className={labelStyle}>
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해주세요"
                    className={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelStyle}>
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="휴대폰 번호를 입력해주세요"
                    className={inputStyle}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="id" className={labelStyle}>
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해주세요"
                    className={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelStyle}>
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="휴대폰 번호를 입력해주세요"
                    className={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelStyle}>
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력해주세요"
                    className={inputStyle}
                    required
                  />
                </div>
              </>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              찾기
            </motion.button>
          </form>

          {result && (
            <p className="mt-4 text-center text-sm text-amber-600">{result}</p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link
              to="/login"
              className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
            >
              로그인으로 돌아가기
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FindPage;
