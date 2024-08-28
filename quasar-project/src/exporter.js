import { exportFile } from "quasar";

export default function useExporter() {
  function wrapCsvValue(val, formatFn, row) {
    let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

    formatted =
      formatted === void 0 || formatted === null ? "" : String(formatted);

    formatted = formatted.split('"').join('""');

    /**
     * Excel accepts \n and \r in strings, but some other CSV parsers do not
     * Uncomment the next two lines to escape new lines
     */
    // .split("\n")
    // .join("\\n")
    // .split("\r")
    // .join("\\r");

    return `"${formatted}"`;
  }

  function toCsv(columns, rows, exportName) {
    console.log(`exportCsvTable`);
    console.log(columns);
    console.log(rows);
    console.log(exportName);
    // naive encoding to csv format
    const content = [columns.map((col) => wrapCsvValue(col.label))]
      .concat(
        rows.map((row) =>
          columns
            .map((col) =>
              wrapCsvValue(
                typeof col.field === "function"
                  ? col.field(row)
                  : row[col.field === void 0 ? col.name : col.field],
                col.format,
                row
              )
            )
            .join(",")
        )
      )
      .join("\r\n");

    const status = exportFile(
      `${exportName}.csv`,
      "\ufeff" + content,
      "text/csv"
    );

    if (status === true) {
    } else {
    }
  }

  return { toCsv };
}
