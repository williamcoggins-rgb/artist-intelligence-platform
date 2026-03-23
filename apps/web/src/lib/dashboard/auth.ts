import { cookies } from "next/headers";

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || "artist2026";
const SESSION_COOKIE = "dashboard_session";
const SESSION_TOKEN = "authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === SESSION_TOKEN;
}

export function validatePassword(password: string): boolean {
  return password === DASHBOARD_PASSWORD;
}

export { SESSION_COOKIE, SESSION_TOKEN };
