import { defineStore } from "pinia";
import * as api from "../api/data";
import useDialog from "src/dialog";

export const useItemStore = defineStore("item", {
  state: () => ({
    datas: [],
  }),

  getters: {
    itemDatas: (state) => state.datas,
  },

  actions: {
    async loadDatas() {
      if (this.datas == null || this.datas.length == 0) {
        this.datas = await api.fetchItem();
      }
    },

    getItemObject(id) {
      return this.datas[id];
    },

    getItemName(id) {
      return this.getItemObject(id)?.name ?? "등록되지 않은 아이템";
    },

    attachItemName(items) {
      const newItems = items.map((item) => {
        const name = getItemName(item.classId);
        return { name, ...item };
      });
      return newItems;
    },

    async searchDatas(inputString) {
      await this.loadDatas();

      inputString = inputString.toLowerCase();
      const searchedList = Object.values(this.datas).filter((data) => {
        //search name
        var strLower = data.name.toLowerCase();

        const words = inputString.split(" ");

        const match = words.every((word) => {
          return strLower.includes(word);
        });
        // var indices = inputString.split("").map((character) => {
        //   return strLower.indexOf(character);
        // });

        // const match = indices.every((current, i) => {
        //   return current === 0 || current > indices[i - 1];
        // });
        if (match === true) {
          return true;
        } else {
          // search number
          return String(data.classId).indexOf(inputString) !== -1;
        }
      });
      return searchedList;
    },
  },
});
