import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { TableFilterField } from "../../types/table.types.js";
import {
  resetDraftFilters,
  updateDraftFilterValue,
} from "./tableFilterState.js";
import type { TableFilterValues } from "./tableFilterState.js";

type TableFiltersProps = {
  fields: TableFilterField[];
  initialValues?: TableFilterValues;
  onApply: (filters: TableFilterValues) => void;
  onReset: () => void;
  className?: string;
};

const fieldFrameClass = "flex min-h-16 flex-col";
const fieldTitleClass = "text-sm font-medium text-muted";
const fieldControlsClass = "mt-auto pt-2";
const controlClass =
  "h-9 w-full rounded-md border border-primary-300 bg-primary-500 px-3 text-default outline-none focus:border-primary-100";

function compactFilters(filters: TableFilterValues): TableFilterValues {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value.trim().length > 0),
  );
}

function fieldValue(draft: TableFilterValues, key: string): string {
  return draft[key] ?? "";
}

export function TableFilters({
  fields,
  initialValues = {},
  onApply,
  onReset,
  className = "",
}: TableFiltersProps) {
  const [draft, setDraft] = useState<TableFilterValues>(initialValues);

  const setValue = (key: string, value: string) => {
    setDraft((currentDraft) =>
      updateDraftFilterValue(currentDraft, key, value),
    );
  };

  const handleApply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply(compactFilters(draft));
  };

  const handleReset = () => {
    setDraft(resetDraftFilters());
    onReset();
  };

  const handleChange =
    (key: string) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValue(key, event.target.value);
    };

  return (
    <form
      className={`rounded-lg border border-primary-300 bg-primary-500 p-4 ${className}`}
      onSubmit={handleApply}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => {
          if (field.kind === "text") {
            return (
              <label key={field.key} className={fieldFrameClass}>
                <span className={fieldTitleClass}>{field.label}</span>
                <span className={fieldControlsClass}>
                  <input
                    className={controlClass}
                    name={field.key}
                    placeholder={field.placeholder}
                    type="text"
                    value={fieldValue(draft, field.key)}
                    onChange={handleChange(field.key)}
                  />
                </span>
              </label>
            );
          }

          if (field.kind === "enum") {
            return (
              <label key={field.key} className={fieldFrameClass}>
                <span className={fieldTitleClass}>{field.label}</span>
                <span className={fieldControlsClass}>
                  <select
                    className={controlClass}
                    name={field.key}
                    value={fieldValue(draft, field.key)}
                    onChange={handleChange(field.key)}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            );
          }

          if (field.kind === "matchMode") {
            return (
              <label key={field.key} className={fieldFrameClass}>
                <span className={fieldTitleClass}>{field.label}</span>
                <span className={fieldControlsClass}>
                  <select
                    className={controlClass}
                    name={field.key}
                    value={fieldValue(draft, field.key) || "contains"}
                    onChange={handleChange(field.key)}
                  >
                    <option value="contains">Contains</option>
                    <option value="exact">Exact</option>
                  </select>
                </span>
              </label>
            );
          }

          if (field.kind === "numberRange") {
            return (
              <fieldset key={field.label} className={fieldFrameClass}>
                <legend className={fieldTitleClass}>{field.label}</legend>
                <div className={`${fieldControlsClass} grid grid-cols-2 gap-2`}>
                  <label className="flex flex-col gap-1 text-xs font-medium text-muted">
                    {field.minLabel ?? "Min"}
                    <input
                      className={controlClass}
                      name={field.minKey}
                      type="number"
                      value={fieldValue(draft, field.minKey)}
                      onChange={handleChange(field.minKey)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-medium text-muted">
                    {field.maxLabel ?? "Max"}
                    <input
                      className={controlClass}
                      name={field.maxKey}
                      type="number"
                      value={fieldValue(draft, field.maxKey)}
                      onChange={handleChange(field.maxKey)}
                    />
                  </label>
                </div>
              </fieldset>
            );
          }

          return (
            <fieldset key={field.label} className={fieldFrameClass}>
              <legend className={fieldTitleClass}>{field.label}</legend>
              <div className={`${fieldControlsClass} grid grid-cols-2 gap-2`}>
                <label className="flex flex-col gap-1 text-xs font-medium text-muted">
                  {field.fromLabel ?? "From"}
                  <input
                    className={controlClass}
                    name={field.fromKey}
                    type="datetime-local"
                    value={fieldValue(draft, field.fromKey)}
                    onChange={handleChange(field.fromKey)}
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-muted">
                  {field.toLabel ?? "To"}
                  <input
                    className={controlClass}
                    name={field.toKey}
                    type="datetime-local"
                    value={fieldValue(draft, field.toKey)}
                    onChange={handleChange(field.toKey)}
                  />
                </label>
              </div>
            </fieldset>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          className="rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-default hover:bg-primary-400"
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
          type="submit"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
