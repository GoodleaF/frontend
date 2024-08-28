import http from "./http";

export async function getSpecifications(searchAll, beginDate, endDate) {
  const response = await http.get(
    `/payment/itemspec?&searchAll=${searchAll}&beginDate=${beginDate}&endDate=${endDate}`
  );
  return response.data;
}

export async function insertSpecification(form) {
  const response = await http.post("/payment/itemdraft", {
    form,
  });
  return response;
}

export async function processApproval(seq, step) {
  const response = await http.post("/payment/itemapproval", {
    seq: seq,
    step: step,
  });
  return response.data;
}

export async function paymentConfirmUser(form) {
  const response = await http.post("/payment/itemconfirm/user", {
    form,
  });
  return response.data;
}

export async function paymentConfirmServer(servers, form) {
  const response = await http.post("/payment/itemconfirm/server", {
    form,
  });
  return response.data;
}

export async function paymentConfirmAllAccount(form) {
  const response = await http.post("/payment/itemconfirm/all", {
    form,
  });
  return response.data;
}

export async function deleteSpec(seqToDelete) {
  const response = await http.post("/payment/deletespec", {
    seq: seqToDelete,
  });
  return response.data;
}
