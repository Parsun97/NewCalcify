import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

function getUserId(): string {
  let userId = localStorage.getItem("calcify_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("calcify_user_id", userId);
  }
  return userId;
}

export function getUserIdValue(): string {
  return getUserId();
}

export function usePro() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    fetch(`${API_BASE}/api/subscriptions/status`, {
      headers: { "x-user-id": userId },
    })
      .then((r) => r.json())
      .then((data) => {
        setIsPro(data.isPro);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { isPro, loading };
}
