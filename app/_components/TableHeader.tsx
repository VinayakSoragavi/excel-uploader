import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableHeaderProps } from '../../types/excel-table';

export function TableHeaderComponent({ headers, onSort }: TableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        {headers.map((header: string, index: number) => (
          <TableHead
            key={index}
            className="cursor-pointer"
            onClick={() => onSort(index)}
          >
            {header}
          </TableHead>
        ))}
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

