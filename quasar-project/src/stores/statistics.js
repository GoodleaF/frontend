import { defineStore } from "pinia";
import { Notify } from "quasar";
import * as api from "../api/statistics";

export const useStatisticsStore = defineStore("statistics", {
  state: () => ({
    purchaseHist: [],
    concurrentUserSerachDate: "",
    concurrentUser: [],
    returnUserRetention: [],
    newUserRetention: [],
    electronJumpRank: [],
    electronJumpLog: [],
  }),

  getters: {
    cashShopPurchaseHist(state) {
      return state.purchaseHist;
    },
    ConCurrentUser(state) {
      return state.concurrentUser;
    },
    ElectronJumpRank(state) {
      return state.electronJumpRank;
    },
    ElectronJumpLog(state) {
      return state.electronJumpLog;
    },
  },

  actions: {
    async loadReturnUserRetention({start, end}){
      const response = await api.getSurvivalRateReturn(start, end);
      this.returnUserRetention = response.data;
      return response.data;
    },

    async loadNewUserRetention({start, end}){
      const response = await api.getSurvivalRateNew(start, end);
      this.newUserRetention = response.data;
      return response.data;
    },

    async loadCashShopQty(year, month) {
      const response = await api.getPurchaseHistOfQty(year, month);

      this.purchaseHist = response.data.sort((a, b) => a.goodsId - b.goodsId);
    },

    async loadCashShopPrice(year, month) {
      const response = await api.getPurchaseHistOfPrice(year, month);
      this.purchaseHist = response.data.sort((a, b) => a.goodsId - b.goodsId);
    },

    async loadConcurrentUser(date) {
      if (this.concurrentUserSerachDate === date) return;
      this.concurrentUserSerachDate = date;
      this.concurrentUser = [];
      const response = await api.getConcurrentUser(date);
      this.concurrentUser = response.data;
    },

    async loadElectronJumpRank({server, rankType, charName}) {
      const response = await api.getElectronJumpRank(server, rankType, charName);

      if (response.data === undefined || response.data.length === 0) {
        Notify.create({
          message: "검색 결과가 없습니다.",
          color: "warning",
          icon: "error",
        });
        throw Error("검색 결과가 없습니다.");
      }

      this.electronJumpRank = response.data;
    },

    async loadElectronJumpLog({server, rankType, start, end, charName}) {
      
      const response = await api.getElectronJumpLog(server, rankType, start, end, charName);

      if (response.data.length === 0) {
        Notify.create({
          message: "검색 결과가 없습니다.",
          color: "warning",
          icon: "error",
        });
        throw Error("검색 결과가 없습니다.");
      }

      this.electronJumpLog = response.data;
      console.log("asdf");
    },

  },
});
