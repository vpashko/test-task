import papaparse from "papaparse";
import { groupByMonths } from "./groupByMonths";

async function fetchData( { path } ) {
  const response = await fetch(
    path
  );
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value);
  const parsedData = papaparse.parse(csv, { header: true });
  const filteredData = parsedData.data.map(row => ({
    pay_package: row.pay_package,
    period_month: row.period_month,
    period_year: row.period_year
  }));

  const resultData = groupByMonths(filteredData);

  return resultData;
}

export { fetchData };