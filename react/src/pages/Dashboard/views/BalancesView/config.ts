import type { TableConfig } from "../../../../types/table.types";
import type { Balance } from "../../../../types/models/balance.types";
import { formatters } from "../../../../utils";

const monoCellClassName = "font-mono text-sm text-default";

export const balancesTableConfig: TableConfig<Balance> = {
  columns: [
    {
      key: "uuid",
      label: "UUID",
      className: monoCellClassName,
    },
    {
      key: "amount",
      label: "Amount",
      className: monoCellClassName,
      render: (value) => formatters.currency(value as number),
    },
  ],
  rowKey: "uuid",
};
