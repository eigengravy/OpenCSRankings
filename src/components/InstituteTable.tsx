"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  GraduationCap,
  Home,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Faculty = {
  name: string;
  homepage: string;
  scholar: string;
  pubs: number;
  adj: number;
  dept: string;
};

type Institute = {
  name: string;
  people: Faculty[];
  size: number;
  pubs: number;
  adjPubs: number;
};

export const instituteColumns: ColumnDef<Institute>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        {column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ml-2 h-4 w-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
      </Button>
    ),
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(!(column.getIsSorted() === "desc"))}
      >
        Faculty
        {column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ml-2 h-4 w-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center pr-8 font-medium">
          {row.getValue("size")}
        </div>
      );
    },
  },
  {
    accessorKey: "pubs",
    header: ({ column }) => (
      <HoverCard openDelay={200}>
        <HoverCardTrigger>
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(!(column.getIsSorted() === "desc"))
            }
            className="underline"
          >
            Pubs
            {column.getIsSorted() === "asc" && (
              <ArrowUp className="ml-2 h-4 w-4" />
            )}
            {column.getIsSorted() === "desc" && (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
            {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>Total number of publications.</HoverCardContent>
      </HoverCard>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center pr-8 font-medium">
          {parseInt(row.getValue("pubs")).toFixed(1)}
        </div>
      );
    },
  },
  {
    accessorKey: "adj",
    header: ({ column }) => (
      <HoverCard openDelay={200}>
        <HoverCardTrigger className="underline">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(!(column.getIsSorted() === "desc"))
            }
            className="underline"
          >
            Adj.
            {column.getIsSorted() === "asc" && (
              <ArrowUp className="ml-2 h-4 w-4" />
            )}
            {column.getIsSorted() === "desc" && (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
            {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          Count divided by number of co-authors.
        </HoverCardContent>
      </HoverCard>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center pr-8 font-medium">
          {parseFloat(row.getValue("adj")).toFixed(1)}
        </div>
      );
    },
  },
];

("use client");

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import * as React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const facultyColumns: ColumnDef<Faculty>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        {column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ml-2 h-4 w-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-row justify-between">
          <p>{row.getValue("name")}</p>
          <div className="flex flex-row gap-2">
            <a href={row.original.homepage} target="_blank">
              <Badge variant="outline">
                <Home className="h-4 w-4" />
              </Badge>
            </a>
            <a
              href={
                "https://scholar.google.com/citations?user=" +
                row.original.scholar
              }
              target="_blank"
            >
              <Badge variant="outline">
                <GraduationCap className="h-4 w-4" />
              </Badge>
            </a>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "pubs",
    header: ({ column }) => (
      <HoverCard openDelay={200}>
        <HoverCardTrigger>
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(!(column.getIsSorted() === "desc"))
            }
            className="underline"
          >
            Pubs
            {column.getIsSorted() === "asc" && (
              <ArrowUp className="ml-2 h-4 w-4" />
            )}
            {column.getIsSorted() === "desc" && (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
            {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>Total number of publications.</HoverCardContent>
      </HoverCard>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center pr-2 font-medium">
          {parseInt(row.getValue("pubs")).toFixed(1)}
        </div>
      );
    },
  },
  {
    accessorKey: "adj",
    header: ({ column }) => (
      <HoverCard openDelay={200}>
        <HoverCardTrigger className="underline">
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(!(column.getIsSorted() === "desc"))
            }
            className="underline"
          >
            Adj.
            {column.getIsSorted() === "asc" && (
              <ArrowUp className="ml-2 h-4 w-4" />
            )}
            {column.getIsSorted() === "desc" && (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
            {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          Count divided by number of co-authors.
        </HoverCardContent>
      </HoverCard>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center pr-2 font-medium">
          {parseFloat(row.getValue("adj")).toFixed(1)}
        </div>
      );
    },
  },
];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <ScrollArea className="h-[75vh] rounded-md border p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <TableRow key={headerGroup.id}>
                <TableHead key="#">#</TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <Collapsible key={i} asChild>
                  <>
                    <CollapsibleTrigger asChild>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        <TableCell key={i + 1}>{i + 1}</TableCell>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={columns.length + 1}>
                          <FacultySubDataTable
                            columns={facultyColumns}
                            data={row.original["people"]}
                          />
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function FacultySubDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    state: {
      sorting,
    },
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, i) => (
            <TableRow key={headerGroup.id}>
              <TableHead key="#">#</TableHead>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, i) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <TableCell key={i + 1}>{i + 1}</TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
