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
      key: "from_player_uuid",
      label: "From",
      className: "font-mono text-sm text-default",
    },
    {
      key: "amount",
      label: "Amount",
      className: "font-mono text-sm text-default",
    },
    {
      key: "to_player_uuid",
      label: "To",
      className: "font-medium text-default",
    },
    {
      key: "created_at",
      label: "Created at",
      render: (value) => formatters.date(value as string),
      className: "text-sm text-muted",
    },
  ],
  rowKey: "id",
};
