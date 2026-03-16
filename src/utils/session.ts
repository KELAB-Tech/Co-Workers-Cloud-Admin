import Cookies from "js-cookie";

const TOKEN_KEY     = "token";
const LAST_ACTIVE   = "last_active";
const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutos
let   destroying    = false;

export const session = {

  set(token: string) {
    Cookies.set(TOKEN_KEY, token, {
      expires: 1 / 3, // 8 horas
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    localStorage.setItem(LAST_ACTIVE, String(Date.now()));
    destroying = false;
  },

  get(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  touch() {
    if (this.get()) {
      localStorage.setItem(LAST_ACTIVE, String(Date.now()));
    }
  },

  isExpiredByInactivity(): boolean {
    const last = localStorage.getItem(LAST_ACTIVE);
    if (!last) return true;
    return Date.now() - Number(last) > INACTIVITY_MS;
  },

  getRoles(): string[] {
    try {
      const user = localStorage.getItem("user");
      if (!user) return [];
      return JSON.parse(user).roles ?? [];
    } catch {
      return [];
    }
  },

  isAdmin(): boolean {
    return this.getRoles().includes("ROLE_ADMIN");
  },

  destroy() {
    if (destroying) return;
    destroying = true;

    Cookies.remove(TOKEN_KEY, { path: "/" });
    localStorage.removeItem(LAST_ACTIVE);
    localStorage.removeItem("user");

    window.location.replace("/signin");
  },
};