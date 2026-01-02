import { TableConfig } from "../../../../types/table.types";
import { Player } from "../../../../types/models/player.types";
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
      className: "font-medium text-default",
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (value) => formatters.date(value),
      className: "text-sm text-muted",
    },
  ],
  rowKey: "uuid",
};
