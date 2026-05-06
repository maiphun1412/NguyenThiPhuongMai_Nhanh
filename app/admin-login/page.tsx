"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_ACCESS_KEY = "nhanh_travel_admin_access";
const ADMIN_USERNAME_KEY = "nhanh_travel_admin_username";

const ADMIN_ACCOUNTS = [
  {
    username: "admin@nhanhtravel.com",
    password: "admin654321",
    displayName: "Quản trị viên",
  },
  {
    username: "root@nhanhtravel.com",
    password: "root654321",
    displayName: "Nhân viên nội bộ",
  },
];

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const cleanUsername = username.trim();

  localStorage.setItem(ADMIN_ACCESS_KEY, "true");
  localStorage.setItem(
    ADMIN_USERNAME_KEY,
    cleanUsername || "demo@nhanhtravel.com"
  );

  router.push("/chat-history");
}

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <aside style={styles.brandPanel}>
          <div style={styles.brandTop}>
            <div style={styles.logoPill}>
              <img src="/trangchu/logo.png" alt="Nhanh Travel" style={styles.logo} />
            </div>

            <div style={styles.secureBadge}>
              <span style={styles.secureDot} />
              Nội bộ
            </div>
          </div>

          <div style={styles.brandContent}>
            <p style={styles.kicker}>Chat Management</p>
            <h1 style={styles.brandTitle}>Quản lý hội thoại khách hàng</h1>
            <p style={styles.brandDesc}>
              Truy cập nhanh lịch sử chat và thông tin khách hàng được trích xuất từ chatbot.
            </p>
          </div>

          <div style={styles.brandBottom}>
            <div style={styles.miniStat}>
              <strong>Lịch sử chat</strong>
              <span>Theo dõi từng phiên trao đổi</span>
            </div>

            <div style={styles.miniStat}>
              <strong>Thông tin trích xuất</strong>
              <span>Email, số điện thoại và nội dung liên hệ</span>
            </div>
          </div>
        </aside>

        <section style={styles.loginPanel}>
          <div style={styles.mobileLogo}>
            <img src="/trangchu/logo.png" alt="Nhanh Travel" style={styles.mobileLogoImage} />
          </div>

          <div style={styles.header}>
            <p style={styles.label}>Nhanh Travel Admin</p>
            <h2 style={styles.title}>Đăng nhập</h2>
            <p style={styles.subtitle}>Nhập tài khoản nội bộ để tiếp tục.</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.inputLabel}>
              Tài khoản
              <div style={styles.inputBox}>
                <span style={styles.icon}>
                  <UserIcon />
                </span>
                <input
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setError("");
                  }}
                  placeholder="Nhập tài khoản"
                  style={styles.input}
                  autoComplete="username"
                />
              </div>
            </label>

            <label style={styles.inputLabel}>
              Mật khẩu
              <div style={styles.inputBox}>
                <span style={styles.icon}>
                  <LockIcon />
                </span>
                <input
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  style={styles.input}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={styles.showButton}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </label>

            {error ? <div style={styles.errorBox}>{error}</div> : null}

            <button type="submit" style={styles.submitButton}>
              Đăng nhập quản trị
              <span style={styles.arrow}>→</span>
            </button>
          </form>

          <div style={styles.note}>
            <span style={styles.noteIcon}>●</span>
            Chỉ dành cho quản trị viên được cấp quyền.
          </div>
        </section>
      </section>
    </main>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.8 20.2c.8-3.4 3.5-5.4 7.2-5.4s6.4 2 7.2 5.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.5 10V8a4.5 4.5 0 0 1 9 0v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10h11A1.5 1.5 0 0 1 19 11.5v7A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-7A1.5 1.5 0 0 1 6.5 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 14v2.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "28px",
    background:
      "linear-gradient(135deg, #f7f9ff 0%, #eef3ff 45%, #f8fbff 100%)",
    fontFamily: '"Times New Roman", Times, serif',
    color: "#0f172a",
  },

  card: {
    width: "100%",
    maxWidth: "980px",
    minHeight: "600px",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    background: "#ffffff",
    border: "1px solid #dbe4f4",
    borderRadius: "32px",
    overflow: "hidden",
    boxShadow:
      "0 35px 90px rgba(15, 23, 42, 0.16), 0 10px 30px rgba(43, 95, 217, 0.08)",
  },

  brandPanel: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "36px",
    background:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.20), transparent 24%), linear-gradient(145deg, #123c9c 0%, #2b5fd9 52%, #5e8fff 100%)",
    color: "#ffffff",
  },

  brandTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
  },

  logoPill: {
    width: "fit-content",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.96)",
    padding: "11px 15px",
    boxShadow: "0 18px 35px rgba(15, 23, 42, 0.18)",
  },

  logo: {
    height: "30px",
    width: "auto",
    display: "block",
  },

  secureBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: "999px",
    padding: "8px 12px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.22)",
    color: "rgba(255,255,255,0.9)",
    fontSize: "14px",
    fontWeight: 800,
  },

  secureDot: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: "#22c55e",
    boxShadow: "0 0 0 5px rgba(34,197,94,0.18)",
  },

  brandContent: {
    maxWidth: "450px",
  },

  kicker: {
    margin: 0,
    color: "rgba(255,255,255,0.78)",
    fontSize: "14px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  brandTitle: {
  margin: "16px 0 0",
  fontSize: "34px",
  lineHeight: "40px",
  fontWeight: 800,
  letterSpacing: "-0.02em",
},

  brandDesc: {
    margin: "18px 0 0",
    maxWidth: "420px",
    color: "rgba(255,255,255,0.82)",
    fontSize: "18px",
    lineHeight: "29px",
  },

  brandBottom: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
  },

  

  loginPanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "48px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,255,0.96))",
  },

  mobileLogo: {
    display: "none",
    justifyContent: "center",
    marginBottom: "18px",
  },

  mobileLogoImage: {
    height: "34px",
    width: "auto",
  },

  header: {
  marginBottom: "30px",
  textAlign: "center",
},

  label: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 800,
    color: "#2b5fd9",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },

  title: {
    margin: "8px 0 0",
    color: "#0f172a",
    fontSize: "38px",
    lineHeight: "44px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },

  subtitle: {
    margin: "9px 0 0",
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "24px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "17px",
  },

  inputLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#334155",
    fontSize: "15px",
    fontWeight: 800,
  },

  inputBox: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "16px",
    border: "1px solid #dbe4f4",
    background: "#ffffff",
    padding: "0 13px",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.035)",
  },

  icon: {
    display: "inline-flex",
    color: "#64748b",
    flexShrink: 0,
  },

  input: {
    minWidth: 0,
    flex: 1,
    height: "46px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: "16px",
    fontFamily: '"Times New Roman", Times, serif',
  },

  showButton: {
    border: "none",
    background: "#eef4ff",
    color: "#2b5fd9",
    borderRadius: "999px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
    fontFamily: '"Times New Roman", Times, serif',
  },

  errorBox: {
    borderRadius: "14px",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    padding: "11px 13px",
    fontSize: "15px",
    lineHeight: "20px",
  },

  submitButton: {
    height: "52px",
    border: "none",
    borderRadius: "17px",
    background: "linear-gradient(135deg, #1d4ed8, #477cf0)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: 800,
    fontFamily: '"Times New Roman", Times, serif',
    boxShadow: "0 16px 34px rgba(43, 95, 217, 0.28)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  arrow: {
    fontSize: "20px",
    lineHeight: 1,
  },

  note: {
    marginTop: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  noteIcon: {
    color: "#22c55e",
    fontSize: "10px",
  },

  miniStat: {
    borderRadius: "20px",
    padding: "15px 16px",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.92)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "15px",
    lineHeight: "21px",
  },
};