// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string;
  // refreshToken: string;
  setTokens: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      setTokens: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ accessToken: "" }),
    }),
    { name: "auth-storage", getStorage: () => sessionStorage }
  )
);
