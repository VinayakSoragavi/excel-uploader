export type CellValue = string | number | boolean | null;
export type Row = CellValue[];
export type Sheet = Row[];
export type SheetData = { [sheetName: string]: Sheet };

export interface ExcelTableProps {
  excelData: SheetData;
  tab: string;
  onDataUpdate: (data: SheetData) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableHeaderProps {
  headers: string[];
  onSort: (columnIndex: number) => void;
}

export interface TableRowProps {
  row: Row;
  headers: string[];
  onEdit: () => void;
  onDelete: () => void;
}

export interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export interface EditingEmployee {
  sheet: string;
  row: number;
  data: Row;
}

export interface DownloadExcelProps{
  excelData: SheetData|null;
}

