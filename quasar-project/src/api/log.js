import http from "./http";

export default {
  getChatLog: async (userID) => {
    const response = await http.get(`/log/chat?id=${userID}`);
    return response.data;
  },
};
