import { TableCell, TableRow } from "@/components/ui/table";
import { ActionButtons } from './ActionButtons';
import { validateRowData } from '../../utils/excel-table-utils';
import { TableRowProps, CellValue } from '../../types/excel-table';

export function TableRowComponent({ row, headers, onEdit, onDelete }: TableRowProps) {
  return (
    <TableRow>
      {validateRowData(row, headers).map(
        (cell: CellValue, cellIndex: number) => (
          <TableCell key={cellIndex}>{String(cell)}</TableCell>
        )
      )}
      <TableCell>
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}

