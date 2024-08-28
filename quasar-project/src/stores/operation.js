import { defineStore } from "pinia";
import * as operationApi from "src/api/operation";

export const useOperationStore = defineStore("operation", {
  state: () => ({
    manager: [],
  }),

  getters: {
    Manager(state) {
      return state.manager;
    },
  },

  actions: {
    async loadManager() {
      const response = await operationApi.loadManager();
      this.manager = response.data;
    },

    async changeGrade(id, grade) {
      const response = await operationApi.changeGrade(id, grade);
      return response;
    },

    async deleteManager(id) {
      const response = await operationApi.deleteManager(id);
      return response;
    },

    async getAnnounceLog(searchAll, beginDate, endDate) {
      const response = await operationApi.loadAnnounceLog(
        searchAll,
        beginDate,
        endDate
      );
      return response.data;
    },

    async insertAnnounceLog(message, servers, name) {
      const response = await operationApi.insertAnnounceLog(
        message,
        servers,
        name
      );
      return response;
    },

    async getSkinscapeLog(searchAll, beginDate, endDate) {
      const response = await operationApi.loadSkinscapeLog(
        searchAll,
        beginDate,
        endDate
      );
      return response.data;
    },

    async insertSkinscapeLog(message, servers, name) {
      const response = await operationApi.insertSkinscapeLog(
        message,
        servers,
        name
      );
      return response;
    },
  },
});
