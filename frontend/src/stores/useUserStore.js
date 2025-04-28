import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  twoFactorRequired: false,
  twoFactorUserId: null,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, loading: false });
      toast.success("Account created successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  login: async (email, password, twoFactorToken = null) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { 
        email, 
        password,
        twoFactorToken 
      });

      // Check if 2FA is required
      if (res.data.requireTwoFactor) {
        set({ 
          loading: false, 
          twoFactorRequired: true,
          twoFactorUserId: res.data.userId
        });
        toast.info(res.data.message || "Please enter your 2FA code");
        return;
      }

      set({ 
        user: res.data, 
        loading: false,
        twoFactorRequired: false,
        twoFactorUserId: null 
      });
      toast.success("Logged in successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Please enter your 2FA code");
    }
  },

  verify2FALogin: async (twoFactorToken) => {
    set({ loading: true });
    const userId = get().twoFactorUserId;

    try {
      const res = await axios.post("/auth/verify-2fa-login", {
        userId,
        twoFactorToken
      });

      set({ 
        user: res.data, 
        loading: false,
        twoFactorRequired: false,
        twoFactorUserId: null
      });
      toast.success("Authentication successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Invalid verification code");
    }
  },

  clearTwoFactorState: () => {
    set({
      twoFactorRequired: false,
      twoFactorUserId: null
    });
  },

  setup2FA: async () => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/setup-2fa");
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to setup 2FA");
      return null;
    }
  },

  verify2FA: async (token) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/verify-2fa", { token });
      
      // Update user with 2FA enabled
      const updatedUser = { ...get().user, twoFactorEnabled: true };
      set({ user: updatedUser, loading: false });
      
      toast.success("Two-factor authentication enabled!");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Invalid verification code");
      return false;
    }
  },

  disable2FA: async (token) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/disable-2fa", { token });
      
      // Update user with 2FA disabled
      const updatedUser = { ...get().user, twoFactorEnabled: false };
      set({ user: updatedUser, loading: false });
      
      toast.success("Two-factor authentication disabled!");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Invalid verification code");
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ 
        user: null,
        twoFactorRequired: false,
        twoFactorUserId: null
      });
      toast.success("Logged out successfully");
      return Promise.resolve(); 
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
      return Promise.reject(error); 
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    
    try {
      const response = await axios.put('/auth/update-password', {
        currentPassword,
        newPassword
      });
      
      set({ loading: false });
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update password";
      set({ 
        loading: false, 
        error: errorMessage 
      });
      toast.error(errorMessage);
      return false;
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default useUserStore;