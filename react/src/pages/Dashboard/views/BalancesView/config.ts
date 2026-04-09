import type { TableConfig } from "../../../../types/table.types.js";
import type { Balance } from "../../../../types/models/balance.types.js";
import { formatters } from "../../../../utils/formatters.js";

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
