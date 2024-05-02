function groupByMonths(data) {
  const groupedData = {};

  data.forEach(item => {
    const { pay_package, period_month, period_year } = item;
    const key = `${period_month}-${period_year}`;
  
    if (groupedData[key]) {
      groupedData[key] += parseFloat(pay_package);
    } else {
      groupedData[key] = parseFloat(pay_package);
    }
  });

  const result = Object.keys(groupedData).map(key => {
    const [period_month, period_year] = key.split('-');
    return {
      period_month: parseInt(period_month),
      period_year: parseInt(period_year),
      pay_package: groupedData[key].toFixed(2),
    };
  });
  
  result.sort((a, b) => {
    return a.period_year - b.period_year || a.period_month - b.period_month;
  });
  
  return result;
}

export { groupByMonths };