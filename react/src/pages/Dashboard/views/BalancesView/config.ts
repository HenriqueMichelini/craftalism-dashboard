import type { TableConfig } from "../../../../types/table.types";
import type { Balance } from "../../../../types/models/balance.types";

export const balancesTableConfig: TableConfig<Balance> = {
  columns: [
    {
      key: "uuid",
      label: "UUID",
      className: "font-mono text-sm text-default",
    },
    {
      key: "amount",
      label: "Amount",
      className: "font-medium text-default",
    },
  ],
  rowKey: "uuid",
};
