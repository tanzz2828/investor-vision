// ============================================================
// api.ts — small helper for backend API calls
// All requests go through VITE_API_BASE_URL.
// On 401, calls the injected logout callback to clear auth state.
// ============================================================

const BASE = import.meta.env.VITE_API_BASE_URL as string;

// Logout callback — set by AuthContext so we can clear state on 401
let _logout: (() => void) | null = null;

/** Inject the logout function (called once by AuthContext on mount) */
export function setLogoutCallback(fn: () => void) {
  _logout = fn;
}

/** Generic fetch wrapper that throws on non-2xx and handles 401 */
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // 401 → clear auth state and redirect to signin
  if (res.status === 401) {
    _logout?.();
    return Promise.reject(new Error("Session expired. Please sign in again."));
  }

  if (!res.ok) {
    // Try to get the error detail from the backend
    let message = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      message = body.detail || message;
    } catch {
      // ignore parse failure
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

/** Make an authenticated request (adds Bearer token) */
async function authRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

// ── Auth API ──────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: { id: string; email: string };
}

export function signup(email: string, password: string) {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(token: string) {
  return authRequest<{ id: string; email: string }>("/auth/me", token);
}

// ── Profile API ────────────────────────────────────────────────

/** Raw shape returned by the backend (nulls from Postgres) */
export interface ProfileResponse {
  full_name: string | null;
  phone: string | null;
  contact_time: string | null;
  budget: string | null;
  property_type: string | null;
  preferred_areas: string | null;
  investment_goal: string | null;
  status: string;
}

/** Frontend-friendly shape — nulls converted to "" */
export interface ProfileData {
  fullName: string;
  phone: string;
  contactTime: string;
  budget: string;
  propertyType: string;
  preferredAreas: string;
  investmentGoal: string;
  status: string;
}

/** Convert backend response to frontend-friendly shape */
function toProfileData(raw: ProfileResponse): ProfileData {
  return {
    fullName: raw.full_name ?? "",
    phone: raw.phone ?? "",
    contactTime: raw.contact_time ?? "",
    budget: raw.budget ?? "",
    propertyType: raw.property_type ?? "",
    preferredAreas: raw.preferred_areas ?? "",
    investmentGoal: raw.investment_goal ?? "",
    status: raw.status ?? "draft",
  };
}

export function getProfile(token: string) {
  return authRequest<ProfileResponse>("/profile", token).then(toProfileData);
}

export function saveDetails(
  token: string,
  data: { full_name: string; phone: string; contact_time: string },
) {
  return authRequest<ProfileResponse>("/profile/details", token, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then(toProfileData);
}

export function saveBrief(
  token: string,
  data: { budget: string; property_type: string; preferred_areas: string; investment_goal: string },
) {
  return authRequest<ProfileResponse>("/profile/brief", token, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then(toProfileData);
}