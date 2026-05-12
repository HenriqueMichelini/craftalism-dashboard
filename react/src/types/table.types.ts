export type ColumnDefinition<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
};

export type TableConfig<T> = {
  columns: ColumnDefinition<T>[];
  rowKey: keyof T;
};

export type TableState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
};

export type TableFilterOption = {
  label: string;
  value: string;
};

export type TextTableFilterField = {
  kind: "text";
  key: string;
  label: string;
  placeholder?: string;
};

export type EnumTableFilterField = {
  kind: "enum";
  key: string;
  label: string;
  options: TableFilterOption[];
};

export type MatchModeTableFilterField = {
  kind: "matchMode";
  key: string;
  label: string;
};

export type NumberRangeTableFilterField = {
  kind: "numberRange";
  minKey: string;
  maxKey: string;
  label: string;
  minLabel?: string;
  maxLabel?: string;
};

export type DateRangeTableFilterField = {
  kind: "dateRange";
  fromKey: string;
  toKey: string;
  label: string;
  fromLabel?: string;
  toLabel?: string;
};

export type TableFilterField =
  | TextTableFilterField
  | EnumTableFilterField
  | MatchModeTableFilterField
  | NumberRangeTableFilterField
  | DateRangeTableFilterField;
