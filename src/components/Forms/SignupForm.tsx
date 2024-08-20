import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJoin, getCheckNickname, getCheckEmail } from "../../apis/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import InputField from "./InputField";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    emailId: "",
    emailDomain: "gmail.com",
    password: "",
    confirmPassword: "",
    birthDate: "",
    phone: "",
    name: "",
  });

  const [formStatus, setFormStatus] = useState({
    nicknameError: "",
    emailError: "",
    errorMessage: "",
    isNicknameChecked: false,
    isEmailChecked: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleEmailDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      emailDomain: value,
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    value = value
      .replace(/[^0-9]/g, "")
      .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");

    setFormData((prevData) => ({
      ...prevData,
      phone: value,
    }));
  };

  const handleNicknameCheck = async () => {
    const { nickname } = formData;
    if (!nickname.trim()) return;

    try {
      const isNicknameAvailable = await getCheckNickname({ nickname });
      setFormStatus((prevStatus) => ({
        ...prevStatus,
        nicknameError: isNicknameAvailable
          ? "이미 사용 중인 닉네임입니다."
          : "사용 가능한 닉네임입니다.",
        isNicknameChecked: !isNicknameAvailable,
      }));
    } catch (err) {
      console.error("Nickname check failed", err);
      setFormStatus((prevStatus) => ({
        ...prevStatus,
        nicknameError: "닉네임 중복 체크에 실패했습니다.",
      }));
    }
  };

  const handleEmailCheck = async () => {
    const { emailId, emailDomain } = formData;
    const email = `${emailId}@${emailDomain}`;
    if (!emailId.trim()) return;

    try {
      const isEmailAvailable = await getCheckEmail({ email });
      setFormStatus((prevStatus) => ({
        ...prevStatus,
        emailError: isEmailAvailable
          ? "이미 사용 중인 이메일입니다."
          : "사용 가능한 이메일입니다.",
        isEmailChecked: !isEmailAvailable,
      }));
    } catch (err) {
      console.error("Email check failed", err);
      setFormStatus((prevStatus) => ({
        ...prevStatus,
        emailError: "이메일 중복 체크에 실패했습니다.",
        isEmailChecked: false,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      nickname,
      emailId,
      emailDomain,
      password,
      confirmPassword,
      birthDate,
      phone,
      name,
    } = formData;
    const { isNicknameChecked, isEmailChecked } = formStatus;

    setIsLoading(true);

    if (password !== confirmPassword) {
      setFormStatus((prevStatus) => ({
        ...prevStatus,
        errorMessage: "비밀번호가 일치하지 않습니다.",
      }));
      setIsLoading(false);
      return;
    }

    if (!birthDate) {
      setFormStatus((prevStatus) => ({
        ...prevStatus,
        errorMessage: "생년월일을 선택해주세요.",
      }));
      setIsLoading(false);
      return;
    }

    if (!isNicknameChecked || !isEmailChecked) {
      setFormStatus((prevStatus) => ({
        ...prevStatus,
        errorMessage: isNicknameChecked
          ? "이메일 중복 체크를 해주세요."
          : "닉네임 중복 체크를 해주세요.",
      }));
      setIsLoading(false);
      return;
    }

    const email = `${emailId}@${emailDomain}`;
    try {
      const formattedBirthDate = new Date(birthDate)
        .toISOString()
        .split("T")[0];
      await getJoin({
        email,
        password,
        nickname,
        birthdate: formattedBirthDate,
        phone,
        name,
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup failed", err);
      setFormStatus((prevStatus) => ({
        ...prevStatus,
        errorMessage: "회원가입에 실패했습니다. 다시 시도해 주세요.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        회원가입
      </h2>
      <form onSubmit={handleSubmit} method="POST" className="space-y-6">
        <InputField
          label="이름"
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          label="닉네임"
          id="nickname"
          type="text"
          value={formData.nickname}
          onChange={handleChange}
          error={formStatus.nicknameError}
          onCheck={handleNicknameCheck}
          checkButtonLabel="중복 확인"
          isChecked={formStatus.isNicknameChecked}
        />
        <div className="space-y-2">
          <label
            htmlFor="emailId"
            className="block text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <div className="flex space-x-2">
            <input
              id="emailId"
              type="text"
              value={formData.emailId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
            <select
              id="emailDomain"
              value={formData.emailDomain}
              onChange={handleEmailDomainChange}
              className="mt-1 block w-auto px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="gmail.com">gmail.com</option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
              <option value="knu.ac.kr">knu.ac.kr</option>
            </select>
            <button
              type="button"
              onClick={handleEmailCheck}
              className="mt-1 px-4 py-2 bg-amber-600 text-white rounded-md shadow-sm hover:bg-amber-500 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 whitespace-nowrap"
            >
              중복 확인
            </button>
          </div>
          {formStatus.emailError && (
            <p
              className={`text-sm ${
                formStatus.isEmailChecked ? "text-blue-500" : "text-red-500"
              }`}
            >
              {formStatus.emailError}
            </p>
          )}
        </div>
        <InputField
          label="비밀번호"
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <InputField
          label="비밀번호 확인"
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <InputField
          label="생년월일"
          id="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
        />
        <InputField
          label="전화번호"
          id="phoneNumber"
          type="text"
          value={formData.phone}
          onChange={handlePhoneNumberChange}
        />
        {formStatus.errorMessage && (
          <p className="text-red-500 text-sm">{formStatus.errorMessage}</p>
        )}
        <div>
          <button
            type="submit"
            disabled={
              !formStatus.isEmailChecked || !formStatus.isNicknameChecked
            }
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black ${
              !formStatus.isNicknameChecked || !formStatus.isEmailChecked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-600/40 hover:bg-amber-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
          >
            {isLoading ? <LoadingSpinner /> : "회원가입"}
          </button>
        </div>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{" "}
        <Link
          to="/login"
          className="font-medium text-amber-600 hover:text-amber-500"
        >
          로그인
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
