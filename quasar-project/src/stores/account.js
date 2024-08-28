import { defineStore } from "pinia";
import * as api from "../api/account.js";

export const useAccountStore = defineStore("account", {
  state: () => ({
    users: [],
    characters: [],
  }),

  getters: {
    accountUsers: (state) => state.users,
    accountCharacters: (state) => state.characters,
  },

  actions: {
    async loadAccountUsers(accountId, searchOption) {
      accountId = accountId ?? ''
      const response = await api.fetchAccountUsers(accountId, searchOption);
      console.log('goodleaf', response);
      this.users = response.data;
    },
    async loadAccountCharacters(uId) {
      uId = uId ?? ''
      const response = await api.fetchAccountCharacters(uId);
      console.log('goodleaf', response);
      this.characters = response.data;
    },
  },
});
