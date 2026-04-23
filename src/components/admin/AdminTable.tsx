import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: Extract<keyof T, string>;
  label: string;
  className?: string;
  render?: (value: unknown, row: T) => ReactNode;
};

type AdminTableProps<T extends { id: string }> = {
  columns: Array<Column<T>>;
  rows: T[];
};

export function AdminTable<T extends { id: string }>({ columns, rows }: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-mist bg-white">
      <div className="hidden grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 border-b border-mist bg-cream/70 px-5 py-3 text-xs uppercase tracking-[0.22em] text-charcoal/55 md:grid">
        {columns.map((column) => (
          <span key={String(column.key)} className={column.className}>
            {column.label}
          </span>
        ))}
      </div>
      <div className="divide-y divide-mist">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid gap-3 px-5 py-4 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:items-center"
          >
            {columns.map((column) => {
              const value = row[column.key as keyof T];
              return (
                <div key={String(column.key)} className={cn("text-sm text-charcoal/78", column.className)}>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-charcoal/45 md:hidden">
                    {column.label}
                  </p>
                  {column.render ? column.render(value, row) : String(value)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
