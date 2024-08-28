import http from "./http";

const getPurchaseHistOfQty = async (year, month) => {
  const response = await http.get(
    `/statistics/shop/qty?year=${year}&month=${month}`
  );
  return response.data;
};

const getPurchaseHistOfPrice = async (year, month) => {
  const response = await http.get(
    `/statistics/shop/price?year=${year}&month=${month}`
  );
  return response.data;
};

const getConcurrentUser = async (date) => {
  const response = await http.get(`/statistics/concurrent-user?date=${date}`);
  return response.data;
};

const getSurvivalRateReturn = async (startDate, endDate) => {
  const response = await http.get(`/statistics/survival-rate-return?start=${startDate}&end=${endDate}`);
  return response.data;
};

const getSurvivalRateNew = async (startDate, endDate) => {
  const response = await http.get(`/statistics/survival-rate-new?start=${startDate}&end=${endDate}`);
  return response.data;
};

const getElectronJumpRank = async (server, rankType, charName) => {
  const response = await http.get(
    `/statistics/electron-jump-rank?server=${server}&rankType=${rankType}&charName=${charName}`
  );
  return response.data;
};

const getElectronJumpLog = async (server, rankType, startDate, endDate, charName) => {
  const response = await http.get(
    `/statistics/electron-jump-log?server=${server}&rankType=${rankType}&start=${startDate}&end=${endDate}&charName=${charName}`
  );
  return response.data;
};

export { getPurchaseHistOfQty, getPurchaseHistOfPrice, getConcurrentUser, getSurvivalRateReturn, getSurvivalRateNew, getElectronJumpRank, getElectronJumpLog};
