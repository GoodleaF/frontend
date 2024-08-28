import { defineStore } from "pinia";
import * as paymentApi from "../api/payment";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    specifications: [],
  }),

  getters: {
    paymentSpecifications: (state) => state.specifications,
  },

  actions: {
    async loadSpecifications(searchAll, beginDate, endDate) {
      const result = await paymentApi.getSpecifications(
        searchAll,
        beginDate,
        endDate
      );
      this.specifications = result.data;
    },

    async insertSpecification(form) {
      await paymentApi.insertSpecification(form);
    },

    async processApproval(seq, step) {
      const result = await paymentApi.processApproval(seq, step);
      return result.data;
    },

    async paymentConfirm(form) {
      let response;
      if (form.type === "p") {
        response = await paymentApi.paymentConfirmUser(form);
      } else if (form.type === "s") {
        response = await paymentApi.paymentConfirmServer(form);
      } else if (form.type === "a") {
        response = await paymentApi.paymentConfirmAllAccount(form);
      }
      return response.data;
    },

    async deleteSpec(seq) {
      const result = await paymentApi.deleteSpec(seq);
      return result.data;
    },
  },
});
