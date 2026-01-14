import type { TableConfig } from "../../../../types/table.types";
import type { Transaction } from "../../../../types/models/transaction.types";
import { formatters } from "../../../../utils";

export const transactionsTableConfig: TableConfig<Transaction> = {
  columns: [
    {
      key: "id",
      label: "Id",
      className: "font-mono text-sm text-default",
    },
    {
      key: "fromPlayerUuid",
      label: "From",
      className: "font-mono text-sm text-default",
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => formatters.currency(value as number),
      className: "font-mono text-sm text-default",
    },
    {
      key: "toPlayerUuid",
      label: "To",
      className: "font-mono text-sm text-default",
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (value) => formatters.date(value as string),
      className: "font-mono text-sm text-default",
    },
  ],
  rowKey: "id",
};
