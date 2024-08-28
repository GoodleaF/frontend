import { defineStore } from "pinia";
import { is } from "quasar";

export const useRankTypeStore = defineStore("rankType", {
  state: () => ({
    rankTypeOptions: [
      { label: "normal", value: "0", color: "teal", mask: 1 },
      { label: "rank", value: "1", color: "orange", mask: 2 },
    ],
    map: {
        normal: { label: "normal", color: "teal", mask: 1 },
        rank: { label: "rank", color: "orange", mask: 2 },
    },
  }),

  getters: {
    Options: (state) => state.rankTypeOptions,
    Values: (state) => state.rankTypeOptions.map((v) => v.value),
    rankTypes: (state) => state.map,
  },

  actions: {
    getLabel(value) {
      return this.map[value]?.label ?? "";
    },

    getColor(value) {
      return this.map[value]?.color ?? "black";
    },
  },
});
