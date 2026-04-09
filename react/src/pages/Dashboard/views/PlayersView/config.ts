import type { TableConfig } from "../../../../types/table.types.js";
import type { Player } from "../../../../types/models/player.types.js";
import { formatters } from "../../../../utils/formatters.js";

const monoCellClassName = "font-mono text-sm text-default";

export const playersTableConfig: TableConfig<Player> = {
  columns: [
    {
      key: "uuid",
      label: "UUID",
      className: monoCellClassName,
    },
    {
      key: "name",
      label: "Name",
      className: monoCellClassName,
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (value) => formatters.date(value as string),
      className: monoCellClassName,
    },
  ],
  rowKey: "uuid",
};
