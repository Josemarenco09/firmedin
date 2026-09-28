import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../lib/api";

export function useApi() {
  const { token, logout } = useAuth();

  return useCallback(
    async (path: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);

      const res = await fetch(`${API_URL}${path}`, { ...init, headers });

      if (res.status === 401) {
        logout();
        throw new Error("Sesión vencida");
      }
      return res;
    },
    [token, logout],
  );
}
