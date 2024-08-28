import { defineStore } from "pinia";
import { Notify } from "quasar";
import * as api from "../api/user.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    server: "",
    data: {},
    inventory: [],
    digimon: [],
    quest: [],
    macro: [],
    chat: [],
    mail: [],
  }),

  getters: {
    userServer: (state) => state.server,
    userInfo: (state) => state.data,
    userInventory: (state) => state.inventory,
    userDigimon: (state) => state.digimon,
    userQuest: (state) => state.quest,
    userMacro: (state) => state.macro,
    userChat: (state) => state.chat,
    userMail: (state) => state.mail,
  },

  actions: {
    clear() {
      this.server = "";
      this.data = {};
      this.inventory = [];
      this.digimon = [];
      this.quest = [];
      this.macro = [];
      this.chat = [];
      this.mail = [];
    },

    async loadUserInfo(searchServer, searchName, searchOption) {
      this.server = searchServer;
      const response = await api.fetchUserInfo(searchServer, searchName, searchOption);
      if (response.data.length === 0) {
        Notify.create({
          message: "검색 결과가 없습니다.",
          color: "warning",
          icon: "error",
        });
        throw Error("검색 결과가 없습니다.");
      }
      this.data = response.data[0];
    },

    async loadUserBan() {
      const response = await api.fetchUserBan(this.data.accountId);
      if (response.data.length === 0) {
        this.data.banned = false;
        this.data.banEndTime = null;
        this.data.banReason = "";
        return;
      }
      this.data.banned = true;
      this.data.banEndTime = response.data[0].banEndTime;
      this.data.banReason = response.data[0].banReason;
    },

    async loadCurrentUserInventory() {
      //todo: if data == null 이면 throw Errror
      const response = await api.fetchUserInventory(
        this.server,
        this.data.userIdx
      );
      this.inventory = response.data;
    },

    async loadUserDigimon() {
      const response = await api.fetchUserDigimon(
        this.server,
        this.data.userIdx
      );
      this.digimon = response.data;
    },

    async loadUserQuest() {
      const response = await api.fetchUserQuest(this.server, this.data.userIdx);
      this.quest = response.data;
    },

    async getTaskOfQuest(questIdx) {
      const response = await api.fetchTaskOfQuest(
        this.server,
        this.data.userIdx,
        questIdx
      );
      return response.data;
    },

    async loadUserMacro(searchAll, beginDate, endDate) {
      const response = await api.fetchUserMacro(
        this.server,
        this.data.userIdx,
        searchAll,
        beginDate,
        endDate
      );
      this.macro = response.data;
    },

    async loadUserChat(searchAll, beginDate, endDate) {
      const response = await api.fetchUserChat(
        this.server,
        this.data.userIdx,
        searchAll,
        beginDate,
        endDate
      );
      this.chat = response.data;
    },

    async getDigimonPotentials(dgmonIdx) {
      const response = await api.fetchDigimonPotential(
        this.server,
        this.data.userIdx,
        dgmonIdx
      );
      return response.data;
    },

    async loadUserMail(mailType, searchAll, beginDate, endDate) {
      const response = await api.fetchUserMail(
        mailType,
        this.data.accountId,
        this.data.userIdx,
        searchAll,
        beginDate,
        endDate
      );
      this.mail = response.data;
    },
  },
});
