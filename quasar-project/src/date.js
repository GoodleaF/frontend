import moment from "moment";
import { isEmptyObject } from "./empty";

export default function useDate() {
  function utcToKst(value, format) {
    const utcDateValue = moment(value, format).valueOf();
    const localDateValue = utcDateValue + 9 * 60 * 60 * 1000;
    return moment(localDateValue).format(format);
  }

  function getFormatString(value, format) {
    return isEmptyObject(value) ? "" : moment.utc(value).format(format);
  }

  return { getFormatString };
}
