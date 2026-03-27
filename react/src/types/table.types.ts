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
