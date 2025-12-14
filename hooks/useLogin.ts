"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export function useLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    setEmail("demo@tradingview.com");
    setPassword("demo123");
    setError("");
    setIsLoading(true);

    const result = await login("demo@tradingview.com", "demo123");

    if (!result.success) {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleSubmit,
    handleDemoLogin,
  };
}