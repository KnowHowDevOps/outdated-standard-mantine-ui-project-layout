import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getConfig } from "@/app/config";
import { clearAuthToken, getAuthToken, setAuthToken } from "./auth-token";

const BASE_URL = getConfig("VITE_API_URL_SERVER");
const LOGIN_PATH = "/auth/login";
const PREVIOUS_URL_KEY = "previous_url";

const ALLOWED_UNAUTHENTICATED_PATHS = ["auth/login", "auth"];

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Ensure cookies are sent globally as well (for any raw axios calls below)
axios.defaults.withCredentials = true;

let isRefreshing = false as boolean;
let refreshPromise: Promise<string | null> | null = null;
let pendingQueue: {
  resolve: (token: string | null) => void;
  reject: (err: any) => void;
}[] = [];

const enqueue = (
  resolve: (t: string | null) => void,
  reject: (e: any) => void
) => {
  pendingQueue.push({ resolve, reject });
};
const drainQueueSuccess = (token: string | null) => {
  pendingQueue.forEach((p) => p.resolve(token));
  pendingQueue = [];
};
const drainQueueError = (err: any) => {
  pendingQueue.forEach((p) => p.reject(err));
  pendingQueue = [];
};

async function performRefresh(): Promise<string | null> {
  try {
    // Call refresh endpoint directly with a raw axios instance to avoid interceptor loops
    const { data } = await axios.get(`${BASE_URL}/auth/refresh`, {
      withCredentials: true,
    });
    const token: string | undefined =
      data?.token || data?.accessToken || data?.access_token;
    if (token) {
      setAuthToken(token);
      return token;
    }
    return null;
  } catch (e) {
    return Promise.reject(e);
  }
}

function startRefreshIfNeeded(): Promise<string | null> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = performRefresh()
      .then((t) => {
        drainQueueSuccess(t ?? null);
        return t ?? null;
      })
      .catch((err) => {
        drainQueueError(err);
        throw err;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
  }
  // Non-null assertion because when called, refreshPromise will be set above if it was null
  return refreshPromise!;
}

// Attach Authorization header from stored defaults if present
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;

    // If no response or different error, propagate
    if (!status || !original) {
      return Promise.reject(error);
    }

    const currentPath = window?.location?.pathname || "";
    const isAllowedUnauthenticatedPath = ALLOWED_UNAUTHENTICATED_PATHS.some(
      (path) => currentPath.includes(path)
    );

    // Try refresh only on 401; do not on 403
    if (status === 401 && !original._retry) {
      original._retry = true;

      try {
        const newToken = await startRefreshIfNeeded();
        if (!newToken) {
          throw new Error("No token returned by refresh");
        }

        // Update the Authorization header and retry the original request
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return api.request(original as any);
      } catch (refreshErr) {
        // Refresh failed: clear token and redirect if not on allowed path
        clearAuthToken();
        if (!isAllowedUnauthenticatedPath) {
          try {
            window?.localStorage?.setItem(
              PREVIOUS_URL_KEY,
              window?.location?.href || "/"
            );
          } catch { /* empty */ }
          window?.location?.replace(LOGIN_PATH);
        }
        return Promise.reject(refreshErr);
      }
    }

    // For 403 or already retried 401, optionally redirect
    if ((status === 401 || status === 403) && !isAllowedUnauthenticatedPath) {
      try {
        window?.localStorage?.setItem(
          PREVIOUS_URL_KEY,
          window?.location?.href || "/"
        );
      } catch { /* empty */ }
      window?.location?.replace(LOGIN_PATH);
    }

    return Promise.reject(error);
  }
);
