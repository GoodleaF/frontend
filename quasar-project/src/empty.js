const isEmptyObject = (param) => {
  if (param === undefined || param === null) {
    return true;
  }
  return Object.keys(param).length === 0 && param.constructor === Object;
};

export { isEmptyObject };
