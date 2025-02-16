export const initializeSize = (rows: number, columns: number) => {
  return Array(rows)
    .fill(null)
    .map(() => {
      return Array(columns).fill(null);
    });
};

export const insertRows = (array: any[][], count: number = 1): any[][] => {
  if (!array.length) return [[]];

  return [
    ...array,
    ...Array(count)
      .fill(null)
      .map(() => Array(array[0]?.length).fill(null)),
  ];
};

export const insertColumns = (array: any[][], count: number = 1): any[][] => {
  if (!array.length || !array[0]?.length) return [[null]];

  return array.map(row => [...row, ...Array(count).fill(null)]);
};
