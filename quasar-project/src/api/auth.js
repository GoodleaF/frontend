import http from "./http";

export async function logIn(id, password) {
  const response = await http.post("/auth/login", {
    id: id,
    password: password,
  });

  return response;
}

export async function logOut() {
  const response = await http.post("/auth/logout");

  return response;
}

export async function signUp(id, password, fullName) {
  const response = await http.post("/auth/signup", {
    id: id,
    password: password,
    fullName: fullName,
  });

  return response;
}
