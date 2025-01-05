import { SheetData, Row } from '../types/excel-table';

export const validateRowData = (row: Row, headers: string[]): Row => {
  return headers.map((_, index) =>
    row[index] !== undefined ? row[index] : "N/A"
  );
};

export const filterData = (data: SheetData, term: string): SheetData => {
  if (!term) return data;

  return Object.entries(data).reduce(
    (acc, [sheetName, sheetData]) => {
      if (sheetData.length > 1) {
        const headers = sheetData[0];
        const filteredRows = sheetData.slice(1).filter((row) =>
          row.some((cell) =>
            String(cell).toLowerCase().includes(term.toLowerCase())
          )
        );
        acc[sheetName] = [headers, ...filteredRows];
      }
      return acc;
    },
    {} as SheetData
  );
};

export const sortData = (data: SheetData, sheetName: string, columnIndex: number): SheetData => {
  const newData = { ...data };
  const sheetData = newData[sheetName];
  
  if (sheetData && sheetData.length > 1) {
    const headers = sheetData[0];
    const dataToSort = sheetData.slice(1);

    const sortedSheetData = [
      headers,
      ...dataToSort.sort((a, b) => {
        const aValue = a[columnIndex] ?? "";
        const bValue = b[columnIndex] ?? "";

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        }
        return String(aValue).localeCompare(String(bValue));
      }),
    ];

    newData[sheetName] = sortedSheetData;
  }

  return newData;
};

