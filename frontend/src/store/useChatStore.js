import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ✅ FIX 1: safer API call with fallback and optional chaining
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/get-users");
      // ✅ FIX: ensure users is always an array even if backend sends undefined/null
      set({ users: Array.isArray(res.data?.data) ? res.data.data : [] });
      console.log(res);
    } catch (error) {
      // ✅ FIX: prevent crash by using optional chaining and fallback
      toast.error(error.response?.data?.message || "Failed to load users");
      set({ users: [] }); // fallback
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ✅ FIX 2: added optional chaining in catch to avoid "cannot read message of undefined"
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      // ✅ FIX: ensure messages is always an array
      set({ messages: Array.isArray(res.data?.data) ? res.data.data : [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ✅ FIX 3: added safe extraction of newMessage and optional chaining for errors
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      const newMessage = res.data?.data; // ✅ FIX: safe access
      set({ messages: [...messages, newMessage] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // ✅ FIX 4: prevent "Cannot read properties of null (reading 'on')" error
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // ✅ FIX: check if socket is null or undefined before using
    if (!socket) {
      console.warn("⚠️ Socket not initialized yet — skipping subscribeToMessages");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // ✅ FIX 5: prevent crash when socket is null on unsubscribe
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return; // ✅ FIX: safe guard
    socket.off("newMessage");
  },

  // ✅ FIX 6: no issue here, just sets the selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
