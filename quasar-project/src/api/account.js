import http from "./http";

export async function fetchAccountUsers(accountId, searchOption) {
  const response = await http.get(`/account/users?accountId=${accountId}&searchOption=${searchOption}`);
  console.log('goodleaf', response);
  if (response.status != 200) {
    throw Error("Account User 얻어오기 실패");
  }
  return response.data;
}

export async function fetchAccountCharacters(uId) {
  const response = await http.get(`/account/characters?uId=${uId}`);
  console.log('goodleaf', response);
  if (response.status != 200) {
    throw Error("Account Character 얻어오기 실패");
  }
  return response.data;
}