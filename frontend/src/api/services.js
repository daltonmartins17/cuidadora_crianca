import api from "./axiosConfig";

// Auth Services
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => localStorage.removeItem("token"),
};

// Profile Services
export const profileService = {
  searchBabySitters: (params) => api.get("/profiles/search", { params }),
  getProfile: (id) => api.get(`/profiles/${id}`),
  getUserProfile: (userId) => api.get(`/profiles/user/${userId}`),
  createProfile: (data) =>
    api.post("/profiles", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
  updateProfile: (id, data) =>
    api.put(`/profiles/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
};

// Message Services
export const messageService = {
  getInbox: () => api.get("/messages/inbox"),
  getSentMessages: () => api.get("/messages/sent"),
  sendMessage: (data) => api.post("/messages/send", data),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
};

// Review Services
export const reviewService = {
  getProfileReviews: (profileId) => api.get(`/reviews/profile/${profileId}`),
  createReview: (data) => api.post("/reviews", data),
};
