import { defineStore } from "pinia";
import * as authApi from "../api/auth";
import { is, SessionStorage } from "quasar";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    manager: null,
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
    isLoginned(state) {
      return is.object(state.manager);
    },
    authManager(state) {
      return state.manager;
    },
  },

  actions: {
    async logIn(userId, password) {
      const response = await authApi.logIn(userId, password);
      if (response.status === 200) {
        this.token = response.token;
        this.manager = response.data.data;
        SessionStorage.set("manager", response.data.data);
      }
      return response;
    },

    async logOut() {
      const response = await authApi.logOut();
      SessionStorage.remove("manager");
      return response;
    },

    async signUp(id, password, fullName) {
      const response = await authApi.signUp(id, password, fullName);
      return response;
    },
  },
});
