export default function useFilter() {
  function findStringContains(stringList, inputString) {
    inputString = inputString.toLowerCase();
    return stringList.filter(function (str) {
      var strLower = str.toLowerCase();
      var indices = inputString.split("").map(function (c) {
        return strLower.indexOf(c);
      });
      return indices.every(function (current, i) {
        return current === 0 || current > indices[i - 1];
      });
    });
  }

  function findNumberContains(numbers, inputString) {
    return numbers.filter(function (num) {
      return String(num).indexOf(inputString) !== -1;
    });
  }

  return { findStringContains, findNumberContains };
}
