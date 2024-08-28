import http from "./http";

export async function loadManager() {
  const response = await http.get("manager");
  return response.data;
}

export async function changeGrade(id, grade) {
  const response = await http.post("manager/grade", {
    id,
    grade,
  });
  return response.data;
}

export async function deleteManager(id) {
  const response = await http.post("manager/del", {
    id,
  });
  return response.data;
}

export async function loadAnnounceLog(searchAll, beginDate, endDate) {
  const response = await http.get(
    `announce?searchAll=${searchAll}&beginDate=${beginDate}&endDate=${endDate}`
  );
  return response.data;
}

export async function insertAnnounceLog(message, servers, name) {
  const response = await http.post("announce", {
    message: message,
    servers: servers,
    name: name,
  });
  return response.data;
}

export async function loadSkinscapeLog(searchAll, beginDate, endDate) {
  const response = await http.get(
    `skinscape?searchAll=${searchAll}&beginDate=${beginDate}&endDate=${endDate}`
  );
  return response.data;
}

export async function insertSkinscapeLog(message, servers, name) {
  const response = await http.post("skinscape", {
    message: message,
    servers: servers,
    name: name,
  });
  return response.data;
}
