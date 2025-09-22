/* eslint-disable dot-notation */
import { api } from "./client";
import { publicApi } from "./public-client";

export const setAuthToken = (token?: string | undefined | null) => {
  if (!token) {
    delete api.defaults.headers.common["Authorization"];
    delete publicApi.defaults.headers.common["Authorization"];
    return;
  }

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  publicApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getAuthToken = (): string | null => {
  const authHeader = api.defaults.headers.common["Authorization"];
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
};

export const clearAuthToken = () => {
  setAuthToken(null);
};
