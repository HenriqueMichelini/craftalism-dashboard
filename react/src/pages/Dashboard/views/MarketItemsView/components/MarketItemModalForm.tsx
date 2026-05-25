import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ModalShell } from "../../../../../components/ui/ModalShell.js";
import type { MarketItem } from "../../../../../types/models/marketItem.types.js";
import {
  marketItemCreateDefaults,
  validateMarketItemForm,
  type MarketItemFormValues,
  type ValidMarketItemValues,
} from "../marketItemValidation.js";

type MarketItemModalFormProps = {
  mode: "create" | "edit";
  item?: MarketItem;
  actionError?: string | null;
  submitting?: boolean;
  onCancel: () => void;
  onDelete?: (item: MarketItem) => void;
  onSave: (values: ValidMarketItemValues) => void;
};

const fieldClass =
  "h-10 w-full rounded-md border border-primary-300 bg-primary-500 px-3 text-default outline-none focus:border-primary-100 disabled:cursor-not-allowed disabled:text-muted read-only:cursor-not-allowed read-only:text-muted";
const checkboxClass =
  "h-4 w-4 rounded border-primary-300 bg-primary-500 text-primary-300";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-muted";
const checkboxLabelClass =
  "flex items-center gap-2 text-sm font-medium text-muted";
const errorClass = "text-sm text-red-400";

function toFormValues(item?: MarketItem): MarketItemFormValues {
  if (!item) {
    return marketItemCreateDefaults;
  }

  return {
    itemId: item.itemId,
    categoryId: item.categoryId,
    categoryDisplayName: item.categoryDisplayName,
    displayName: item.displayName,
    iconKey: item.iconKey,
    currency: item.currency,
    blocked: item.blocked,
    operating: item.operating,
    baseUnitPrice: String(item.baseUnitPrice),
    minUnitPrice: String(item.minUnitPrice),
    maxUnitPrice: String(item.maxUnitPrice),
    segmentSize: String(item.segmentSize),
    priceSensitivity: String(item.priceSensitivity),
    baseRegenQuantity: String(item.baseRegenQuantity),
    regenIntervalSeconds: String(item.regenIntervalSeconds),
    netPosition: String(item.netPosition),
    minNetPosition: item.minNetPosition === null ? "" : String(item.minNetPosition),
    maxNetPosition: item.maxNetPosition === null ? "" : String(item.maxNetPosition),
  };
}

type TextFieldProps = {
  name: keyof MarketItemFormValues;
  label: string;
  type?: "text" | "number";
  step?: string;
  readOnly?: boolean;
  values: MarketItemFormValues;
  errors: Partial<Record<keyof MarketItemFormValues, string>>;
  onChange: (key: keyof MarketItemFormValues, value: string) => void;
};

function TextField({
  name,
  label,
  type = "text",
  step,
  readOnly = false,
  values,
  errors,
  onChange,
}: TextFieldProps) {
  return (
    <label className={labelClass}>
      {label}
      <input
        className={fieldClass}
        name={name}
        readOnly={readOnly}
        step={step}
        type={type}
        value={String(values[name])}
        onChange={(event) => onChange(name, event.target.value)}
      />
      {errors[name] ? <span className={errorClass}>{errors[name]}</span> : null}
    </label>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <fieldset className="space-y-4 rounded-md border border-primary-300 p-4">
      <legend className="px-1 text-sm font-semibold text-default">{title}</legend>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function MarketItemModalForm({
  mode,
  item,
  actionError = null,
  submitting = false,
  onCancel,
  onDelete,
  onSave,
}: MarketItemModalFormProps) {
  const [values, setValues] = useState<MarketItemFormValues>(() =>
    toFormValues(item),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof MarketItemFormValues, string>>
  >({});

  const title = mode === "create" ? "Create Market Item" : "Edit Market Item";
  const identityReadOnly = mode === "edit";

  const updateValue = (key: keyof MarketItemFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateChecked = (key: "blocked" | "operating", value: boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateMarketItemForm(values);

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
          {mode === "edit" && item ? (
            <button
              className="rounded-md border border-red-400 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
              disabled={submitting}
              type="button"
              onClick={() => onDelete?.(item)}
            >
              Remove
            </button>
          ) : null}
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            disabled={submitting}
            form="market-item-modal-form"
            type="submit"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <form
        className="max-h-[70vh] space-y-5 overflow-y-auto pr-1"
        id="market-item-modal-form"
        onSubmit={handleSubmit}
      >
        {actionError ? <p className={errorClass}>{actionError}</p> : null}
        <Section title="Identity">
          <TextField
            name="itemId"
            label="Item ID"
            readOnly={identityReadOnly}
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="categoryId"
            label="Category ID"
            readOnly={identityReadOnly}
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="displayName"
            label="Display Name"
            readOnly={identityReadOnly}
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="categoryDisplayName"
            label="Category Display Name"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="iconKey"
            label="Icon Key"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="currency"
            label="Currency"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
        </Section>
        <Section title="Pricing">
          <TextField
            name="baseUnitPrice"
            label="Base Unit Price"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="minUnitPrice"
            label="Min Unit Price"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="maxUnitPrice"
            label="Max Unit Price"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="priceSensitivity"
            label="Price Sensitivity"
            type="number"
            step="any"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
        </Section>
        <Section title="Stock & Position">
          <TextField
            name="segmentSize"
            label="Segment Size"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="netPosition"
            label="Net Position"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="minNetPosition"
            label="Min Net Position"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="maxNetPosition"
            label="Max Net Position"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
        </Section>
        <Section title="Regeneration">
          <TextField
            name="baseRegenQuantity"
            label="Base Regen Quantity"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
          <TextField
            name="regenIntervalSeconds"
            label="Regen Interval Seconds"
            type="number"
            values={values}
            errors={errors}
            onChange={updateValue}
          />
        </Section>
        <Section title="State">
          <label className={checkboxLabelClass}>
            <input
              checked={values.blocked}
              className={checkboxClass}
              name="blocked"
              type="checkbox"
              onChange={(event) => updateChecked("blocked", event.target.checked)}
            />
            Blocked
          </label>
          <label className={checkboxLabelClass}>
            <input
              checked={values.operating}
              className={checkboxClass}
              name="operating"
              type="checkbox"
              onChange={(event) =>
                updateChecked("operating", event.target.checked)
              }
            />
            Operating
          </label>
        </Section>
      </form>
    </ModalShell>
  );
}
