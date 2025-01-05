"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditEmployeeForm } from "./EditEmployeeForm";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { Input } from "@/components/ui/input";
import { Pagination } from "./Pagination";
import { TableHeaderComponent } from "./TableHeader";
import { TableRowComponent } from "./TableRow";
import { ExcelTableProps, SheetData, EditingEmployee, Row } from '../../types/excel-table';
import { filterData, sortData } from '../../utils/excel-table-utils';

const ROWS_PER_PAGE = 10;

export default function ExcelTable({ excelData, tab, onDataUpdate }: ExcelTableProps) {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState<{ [sheet: string]: number }>(
    Object.keys(excelData).reduce((acc, sheet) => {
      acc[sheet] = 1;
      return acc;
    }, {} as { [sheet: string]: number })
  );
  const [editingEmployee, setEditingEmployee] = useState<EditingEmployee | null>(null);
  const [sortedData, setSortedData] = useState<SheetData>(excelData);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSortedData(excelData);
  }, [excelData]);

  const handlePageChange = (page: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [tab]: page,
    }));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setSortedData(filterData(excelData, term));
  };

  const handleSort = (columnIndex: number) => {
    const newData = sortData(sortedData, tab, columnIndex);
    setSortedData(newData);
    onDataUpdate(newData);
  };

  const handleDelete = (rowIndex: number) => {
    const newData = {
      ...sortedData,
      [tab]: sortedData[tab].filter((_, index) => index !== rowIndex + 1),
    };
    setSortedData(newData);
    onDataUpdate(newData);
  };

  const handleAddEmployee = (newEmployee: Row) => {
    const newData = {
      ...sortedData,
      [tab]: [
        sortedData[tab][0],
        newEmployee,
        ...sortedData[tab].slice(1),
      ],
    };
    setSortedData(newData);
    onDataUpdate(newData);
  };

  const handleEditEmployee = (rowIndex: number, updatedEmployee: Row) => {
    const newData = {
      ...sortedData,
      [tab]: sortedData[tab].map((row, index) =>
        index === rowIndex ? updatedEmployee : row
      ),
    };
    setSortedData(newData);
    onDataUpdate(newData);
    setEditingEmployee(null);
  };

  const totalPages = Math.ceil((sortedData[tab]?.length - 1) / ROWS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Dialog open={add} onOpenChange={setAdd}>
          <DialogTrigger asChild>
            <Button>Add New Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Entry</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm
              headers={sortedData[tab]?.[0] as string[] || []}
              onAddEmployee={handleAddEmployee}
              onOpenChange={setAdd}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeaderComponent 
            headers={sortedData[tab]?.[0] as string[] || []} 
            onSort={handleSort}
          />
          <TableBody>
            {sortedData[tab]
              ?.slice(1)
              .slice(
                (currentPage[tab] - 1) * ROWS_PER_PAGE,
                currentPage[tab] * ROWS_PER_PAGE
              )
              .map((row: Row, rowIndex: number) => (
                <TableRowComponent
                  key={rowIndex}
                  row={row}
                  headers={sortedData[tab][0] as string[]}
                  onEdit={() => {
                    setEditingEmployee({
                      sheet: tab,
                      row: rowIndex + 1,
                      data: row,
                    });
                    setOpen(true);
                  }}
                  onDelete={() => handleDelete(rowIndex)}
                />
              ))}
          </TableBody>
        </Table>
      </div>

      {sortedData[tab]?.length > 1 && (
        <Pagination
          currentPage={currentPage[tab] || 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <EditEmployeeForm
              employee={editingEmployee.data}
              headers={sortedData[tab][0] as string[]}
              onOpenChange={setOpen}
              onEditEmployee={(updatedEmployee) =>
                handleEditEmployee(
                  editingEmployee.row,
                  updatedEmployee
                )
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

