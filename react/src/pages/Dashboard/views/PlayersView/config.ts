import type { TableConfig } from "../../../../types/table.types";
import type { Player } from "../../../../types/models/player.types";
import { formatters } from "../../../../utils";

export const playersTableConfig: TableConfig<Player> = {
  columns: [
    {
      key: "uuid",
      label: "UUID",
      className: "font-mono text-sm text-default",
    },
    {
      key: "name",
      label: "Name",
      className: "font-mono text-sm text-default",
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (value) => formatters.date(value as string),
      className: "font-mono text-sm text-default",
    },
  ],
  rowKey: "uuid",
};
