export type TableFilterValues = Record<string, string>;

export function updateDraftFilterValue(
  draft: TableFilterValues,
  key: string,
  value: string,
): TableFilterValues {
  return {
    ...draft,
    [key]: value,
  };
}

export function resetDraftFilters(): TableFilterValues {
  return {};
}
