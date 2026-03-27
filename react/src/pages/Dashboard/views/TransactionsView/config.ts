import type { TableConfig } from "../../../../types/table.types";
import type { Transaction } from "../../../../types/models/transaction.types";
import { formatters } from "../../../../utils";

const monoCellClassName = "font-mono text-sm text-default";

export const transactionsTableConfig: TableConfig<Transaction> = {
  columns: [
    {
      key: "id",
      label: "Id",
      className: monoCellClassName,
    },
    {
      key: "fromPlayerUuid",
      label: "From",
      className: monoCellClassName,
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => formatters.currency(value as number),
      className: monoCellClassName,
    },
    {
      key: "toPlayerUuid",
      label: "To",
      className: monoCellClassName,
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (value) => formatters.date(value as string),
      className: monoCellClassName,
    },
  ],
  rowKey: "id",
};
