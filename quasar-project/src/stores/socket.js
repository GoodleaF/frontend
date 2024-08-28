import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { Notify, SessionStorage } from "quasar";
import { useServerStore } from "./server";
import { endPoint } from "src/endpoint";

export const useSocketStore = defineStore("socket", {
  state: () => ({
    server: null,
    id: "",
  }),

  getters: {
    Server: (state) => state.server,
  },

  actions: {
    async connect() {
      if (!SessionStorage.has("manager")) return;
      this.server = io(endPoint);

      await this.registerEvent("connect", () => {
        console.log("서버에 연결되었습니다.");
      });

      await this.registerEvent("connect_error", () => {
        console.error("연결 실패");
        setTimeout(() => {
          console.warn("서버와 연결을 재시도 합니다.");
          this.server.connect();
        }, 1000);
      });

      await this.registerEvent("disconnect", (reason) => {
        console.warn("서버와 접속이 끊어졌습니다.");
        if (reason === "io server disconnect") {
          this.server.connect;
        }
      });

      await this.registerEvent("hi", (id, callback) => {
        this.id = id;
        const name = SessionStorage.getItem("manager").fullName;
        const grade = SessionStorage.getItem("manager").grade;
        callback({ name, grade });
      });

      await this.registerEvent("notify_result", (res) => {
        if (res.result === false) {
          Notify.create({
            message: `${res.message}`,
            color: "negative",
            icon: "error",
          });
        } else {
          Notify.create({
            message: `${res.message}`,
            color: "primary",
          });
        }
      });

      return Promise.resolve();
    },

    disconnect() {
      if (this.server) {
        this.server.disconnect();
      }
    },

    async send(key, data) {
      if (!SessionStorage.has("manager")) {
        console.error("send fail, you are not logined");
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        if (this.server.connected) {
          this.server.emit(key, data);
          resolve();
        } else {
          console.error("server not connected!");
          reject();
        }
      });
    },

    async registerEvent(name, listener) {
      return new Promise((resolve) => {
        this.server.on(name, listener);
        resolve();
      });
    },

    async deregisterEvent(name, listener) {
      return new Promise((resolve) => {
        this.server.off(name, listener);
        resolve();
      });
    },

    NotifyError(message) {
      Notify.create({
        message: message,
        color: "negative",
        icon: "error",
      });
    },
  },
});
