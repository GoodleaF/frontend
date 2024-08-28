import { defineStore } from "pinia";
import { is } from "quasar";

export const useSearchTypeStore = defineStore("searchType", {
  state: () => ({
    searchTypeOptions: [
      { label: "patternMathcing", value: "0", color: "teal", mask: 1 }, //패턴매칭
      { label: "ignoreCase", value: "1", color: "orange", mask: 2 }, //대소문자무시
    ],
  }),

  getters: {
    Options: (state) => state.searchTypeOptions,
    Values: (state) => state.searchTypeOptions.map((v) => v.value),
  },

  actions: {

  },
});
