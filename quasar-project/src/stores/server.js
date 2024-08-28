import { defineStore } from "pinia";
import { is } from "quasar";

export const useServerStore = defineStore("server", {
  state: () => ({
    serverOptions: [
      { label: "bearbrick_game01", value: "bearbrick_game01", color: "teal", mask: 1 },
      { label: "bearbrick_game02", value: "bearbrick_game02", color: "orange", mask: 2 },
    ],
    map: {
      bearbrick_game01: { label: "bearbrick_game01", color: "teal", mask: 1 },
      bearbrick_game02: { label: "bearbrick_game02", color: "orange", mask: 2 },
    },
  }),

  getters: {
    Options: (state) => state.serverOptions,
    Values: (state) => state.serverOptions.map((v) => v.value),
    Servers: (state) => state.map,
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
