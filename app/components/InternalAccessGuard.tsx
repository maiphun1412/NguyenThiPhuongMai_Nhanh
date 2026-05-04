"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

const ADMIN_ACCESS_KEY = "nhanh_travel_admin_access";

export default function InternalAccessGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const hasAccess = localStorage.getItem(ADMIN_ACCESS_KEY) === "true";

    if (!hasAccess) {
      router.replace("/admin-login");
      return;
    }

    setAllowed(true);
    setChecked(true);
  }, [router]);

  if (!checked && !allowed) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

const styles: Record<string, React.CSSProperties> = {
  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
    fontFamily: '"Times New Roman", Times, serif',
  },

  loadingCard: {
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #dbe3f0",
    padding: "18px 22px",
    color: "#475569",
    fontSize: "17px",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
  },
};