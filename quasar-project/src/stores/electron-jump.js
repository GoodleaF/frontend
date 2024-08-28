import { defineStore } from "pinia";
import * as api from "../api/electron-jump.js";

export const useElectronJumpStore = defineStore("electron-jump", {
  state: () => ({
    logs: [],
  }),

  getters: {
    electronJumps: (state) => state.logs,
  },

  actions: {
    async loadElectronJumps(accountId) {
      const response = await api.fetchElectronJumps(accountId);
      console.log('goodleaf', response);
      this.electronJumpLogs = response.data;
    },
  },
});
