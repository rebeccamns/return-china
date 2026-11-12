import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Column = {
  label: string;
  numeric?: boolean;
};

type Row = {
  id: string;
  cells: ReactNode[];
};

type ReadOnlyTableProps = {
  caption: string;
  columns: Column[];
  rows: Row[];
  totalRow?: Row;
  minWidth?: string;
};

export default function ReadOnlyTable({
  caption,
  columns,
  rows,
  totalRow,
  minWidth = "min-w-[760px]",
}: ReadOnlyTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table aria-label={caption} className={minWidth}>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.label}
                scope="col"
                className="h-10 whitespace-nowrap px-3 text-left text-xs font-semibold text-white dark:bg-backgroundbg-black dark:text-text-colortext-black"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="h-10">
              {row.cells.map((cell, index) => (
                <TableCell
                  key={`${row.id}-${index}`}
                  className="h-10 whitespace-nowrap border-b border-strokestroke-gray px-3 py-2 text-left text-xs text-text-colortext-black"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {totalRow && (
          <TableFooter>
            <TableRow className="h-10 bg-slate-50 dark:bg-backgroundbg-black">
              {totalRow.cells.map((cell, index) => (
                <TableCell
                  key={`${totalRow.id}-${index}`}
                  className="h-10 whitespace-nowrap px-3 py-2 text-left text-xs font-semibold text-text-colortext-black"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
