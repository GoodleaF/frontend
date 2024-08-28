import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useErrorStore } from "../stores/error";
import { Notify, SessionStorage } from "quasar";
// import { store } from "quasar/wrappers";
import { endPoint } from "src/endpoint";

const instance = axios.create({
  baseURL: endPoint,
  //baseURL: process.env.DEV ? "http://localhost:9001" : "http://20.214.162.82:9001",//live
  withCredentials: true,
  timeout: 5000,
});

// instance.interceptors.request.use(function (config) {
//   const auth = useAuthStore();
//   if (auth.token != null) {
//     config["headers"] = {
//       Authorization: `Bearer ${auth.token}`,
//     };
//   }
//   return config;
// });

instance.interceptors.response.use(
  function (response) {
    //상태코드가 200일때 실행
    // const err = useErrorStore();
    // err.setValidationError({}); //성공시 Error 초기화
    return response;
  },
  function (errors) {
    //상태코드가 200이 아닌오류가 발생
    const errData = errors.response;
    console.error(errData);
    Notify.create({
      message: `${errData.data.message} (${errData.status}:${errData.statusText})`,
      color: "negative",
      icon: "error",
    });
    if (errData.status == 401) {
      console.error("로그인 되어있지 않음");
    }
    if (errors.response.status === 422) {
      const err = useErrorStore();
      err.setValidationError(errors.response.data.data); // 실패시 Error 상태코드 저장
    }
    if (errors.response.status === 401) {
      //권한없음 (login)
      SessionStorage.remove("manager");
      const err = useErrorStore();
      err.setValidationError(errors.response.data.data);
    }
    return Promise.reject({
      status: errData.status,
      message: errData.data.message,
    });
  }
);

export default instance;
