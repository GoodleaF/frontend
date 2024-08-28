import http from "./http";

const fetchItem = async () => {
  const response = await http.get(`/data/item`);
  return response.data;
};

const fetchDigimon = async () => {
  const response = await http.get(`/data/dgmon`);
  return response.data;
};

export { fetchItem, fetchDigimon };
