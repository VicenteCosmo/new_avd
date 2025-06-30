'use client'
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  userId: string | null;
  userName: string | null;
  userLoading: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  setUserId: (id: string | null) => void; 
  setUserName: (name: string | null) => void
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  userId: null,
  userName: null,
  setAccessToken: () => {},
  logout: () => {},
  userLoading: false,
  setUserId: () => {},
  setUserName: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    } else {
      setUserLoading(false); 
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      setUserLoading(true);
      fetch("https://backend-django-2-7qpl.onrender.com/api/funcionarios/me/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.id);
          setUserName(data.nome);
        })
        .catch((err) => {
          console.error(err);
          setAccessToken(null); // token inválido
        })
        .finally(() => {
          setUserLoading(false);
        });
    }
  }, [accessToken]);

  const logout = () => {
    localStorage.removeItem("access_token");
    setAccessToken(null);
    setUserId(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userId,
        userName,
        setAccessToken,
        logout,
        userLoading,
        setUserId,
        setUserName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
