import type { TableConfig } from "../../../../types/table.types";
import type { Player } from "../../../../types/models/player.types";
import { formatters } from "../../../../utils";

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
