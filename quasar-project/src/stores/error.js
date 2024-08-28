import { defineStore } from "pinia";

export const useErrorStore = defineStore("error", {
  state: () => ({
    validations: {},
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    setValidationError(error) {
      this.validations = error;
    },
  },
});
