import { useState } from "react";
import type { FormEvent } from "react";
import { ModalShell } from "../../../../../components/ui/ModalShell.js";
import type { MarketCategory } from "../../../../../types/models/marketCategory.types.js";
import {
  marketCategoryCreateDefaults,
  validateMarketCategoryForm,
  type MarketCategoryFormValues,
  type ValidMarketCategoryValues,
} from "../marketCategoryValidation.js";

type MarketCategoryModalFormProps = {
  mode: "create" | "edit";
  category?: MarketCategory;
  actionError?: string | null;
  submitting?: boolean;
  onCancel: () => void;
  onDelete?: (category: MarketCategory) => void;
  onSave: (values: ValidMarketCategoryValues) => void;
};

const fieldClass =
  "h-10 w-full rounded-md border border-primary-300 bg-primary-500 px-3 text-default outline-none focus:border-primary-100 disabled:cursor-not-allowed disabled:text-muted read-only:cursor-not-allowed read-only:text-muted";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-muted";
const errorClass = "text-sm text-red-400";

function toFormValues(category?: MarketCategory): MarketCategoryFormValues {
  if (!category) return marketCategoryCreateDefaults;

  return {
    categoryId: category.categoryId,
    displayName: category.displayName,
    iconKey: category.iconKey,
    displayOrder: String(category.displayOrder),
  };
}

export function MarketCategoryModalForm({
  mode,
  category,
  actionError = null,
  submitting = false,
  onCancel,
  onDelete,
  onSave,
}: MarketCategoryModalFormProps) {
  const [values, setValues] = useState<MarketCategoryFormValues>(() =>
    toFormValues(category),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof MarketCategoryFormValues, string>>
  >({});

  const title =
    mode === "create" ? "Create Market Category" : "Edit Market Category";

  const updateValue = (key: keyof MarketCategoryFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateMarketCategoryForm(values);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSave(result.values);
  };

  return (
    <ModalShell
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            className="rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-default hover:bg-primary-400"
            disabled={submitting}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          {mode === "edit" && category ? (
            <button
              className="rounded-md border border-red-400 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
              disabled={submitting}
              type="button"
              onClick={() => onDelete?.(category)}
            >
              Remove
            </button>
          ) : null}
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            disabled={submitting}
            form="market-category-modal-form"
            type="submit"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <form
        className="space-y-4"
        id="market-category-modal-form"
        onSubmit={handleSubmit}
      >
        {actionError ? <p className={errorClass}>{actionError}</p> : null}
        <label className={labelClass}>
          Category ID
          <input
            className={fieldClass}
            name="categoryId"
            readOnly={mode === "edit"}
            value={values.categoryId}
            onChange={(event) => updateValue("categoryId", event.target.value)}
          />
          {errors.categoryId ? (
            <span className={errorClass}>{errors.categoryId}</span>
          ) : null}
        </label>
        <label className={labelClass}>
          Display Name
          <input
            className={fieldClass}
            name="displayName"
            value={values.displayName}
            onChange={(event) => updateValue("displayName", event.target.value)}
          />
          {errors.displayName ? (
            <span className={errorClass}>{errors.displayName}</span>
          ) : null}
        </label>
        <label className={labelClass}>
          Block/Item ID
          <input
            className={fieldClass}
            name="iconKey"
            value={values.iconKey}
            onChange={(event) => updateValue("iconKey", event.target.value)}
          />
          {errors.iconKey ? (
            <span className={errorClass}>{errors.iconKey}</span>
          ) : null}
        </label>
        <label className={labelClass}>
          Display Order
          <input
            className={fieldClass}
            name="displayOrder"
            type="number"
            value={values.displayOrder}
            onChange={(event) => updateValue("displayOrder", event.target.value)}
          />
          {errors.displayOrder ? (
            <span className={errorClass}>{errors.displayOrder}</span>
          ) : null}
        </label>
      </form>
    </ModalShell>
  );
}
