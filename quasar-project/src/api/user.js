import http from "./http";

export async function fetchUserInfo(server, name, searchOption) {
  const response = await http.get(`/user?server=${server}&userName=${name}&searchOption=${searchOption}`);

  return response.data;
}

export async function fetchUserBan(accountId) {
  const response = await http.get(`/user/ban?accountId=${accountId}`);

  return response.data;
}

export async function fetchUserInventory(server, userIdx) {
  const response = await http.get(
    `/user/inventory?server=${server}&userIdx=${userIdx}`
  );
  return response.data;
}

export async function fetchUserDigimon(server, userIdx) {
  const response = await http.get(
    `/user/digimon?server=${server}&userIdx=${userIdx}`
  );
  return response.data;
}

export async function fetchDigimonPotential(server, userIdx, dgmonIdx) {
  const response = await http.get(
    `/user/digimon/potential?server=${server}&userIdx=${userIdx}&dgmonIdx=${dgmonIdx}`
  );
  return response.data;
}

export async function deleteUserItem(server, userIdx, itemIdx) {
  const response = await http.post("/user/inventory/delete", {
    server: server,
    userIdx: userIdx,
    itemIdx: itemIdx,
  });
  return response.data;
}

export async function updateCountUserItem(server, userIdx, itemIdx, itemCount) {
  const response = await http.post("/user/inventory/update", {
    server: server,
    userIdx: userIdx,
    itemIdx: itemIdx,
    itemCount: itemCount,
  });
  return response.data;
}

export async function fetchUserQuest(server, userIdx) {
  const response = await http.get(
    `/user/quest?server=${server}&userIdx=${userIdx}`
  );
  return response.data;
}

export async function fetchTaskOfQuest(server, userIdx, questIdx) {
  const response = await http.get(
    `/user/quest/task?server=${server}&userIdx=${userIdx}&questIdx=${questIdx}`
  );
  return response.data;
}

export async function fetchUserMacro(
  server,
  userIdx,
  searchAll,
  beginDate,
  endDate
) {
  const response = await http.get(
    `/user/macro/history?server=${server}&userIdx=${userIdx}&searchAll=${searchAll}&beginDate=${beginDate}&endDate=${endDate}`
  );
  return response.data;
}

export async function fetchUserChat(
  server,
  userIdx,
  searchAll,
  beginDate,
  endDate
) {
  const response = await http.get(
    `/user/chat?server=${server}&userIdx=${userIdx}&searchAll=${searchAll}&beginDate=${beginDate}&endDate=${endDate}`
  );
  return response.data;
}

export async function fetchUserMail(
  mailType,
  accountId,
  userIdx,
  searchAll,
  beginDate,
  endDate
) {
  const response = await http.get(
    `/user/mail?mailType=${mailType}&accountIdx=${accountId}&userIdx=${userIdx}&searchAll=${searchAll}&beginDate=${beginDate}&endDate=${endDate}`
  );
  return response.data;
}
