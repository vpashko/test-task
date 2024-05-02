const getSelection = ( {data, start, end} ) => {
 const startDate = new Date(start[1], start[0] - 1);
  const endDate = new Date(end[1], end[0] - 1);

  const selection = data.filter((item) => {
    const itemDate = new Date(item.period_year, item.period_month - 1);
    return itemDate >= startDate && itemDate <= endDate;
  });

  return selection;
};

export { getSelection };
