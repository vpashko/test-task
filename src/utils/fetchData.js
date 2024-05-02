import Papa from 'papaparse';

export const fetchData = async ({ path }) => {
  try {
    const response = await fetch(path);
    const csvData = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        complete: function (results) {
          const purchases = [];
          const purchasesByMonth = {};

          results.data.forEach(row => {
            const period_month = row.period_month;
            const period_year = row.period_year;
            const pay_package = parseFloat(row.pay_package);

            if (!isNaN(pay_package)) {
              const monthYear = `${period_month}-${period_year}`;

              if (!purchasesByMonth[monthYear]) {
                purchasesByMonth[monthYear] = 0;
              }
              purchasesByMonth[monthYear] += pay_package;
            }
          });

          Object.keys(purchasesByMonth).forEach(monthYear => {
            const [period_month, period_year] = monthYear.split('-');
            let pay_package = purchasesByMonth[monthYear];

            pay_package = parseFloat(pay_package.toFixed(2));

            purchases.push({
              period_month,
              period_year,
              pay_package
            });
          });

          purchases.sort((a, b) => {
            if (a.period_year !== b.period_year) {
              return a.period_year - b.period_year;
            }
          
            return a.period_month - b.period_month;
          });

          resolve(purchases);
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};