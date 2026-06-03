import { useState } from "react";
import type { FormEvent } from "react";
import { ModalShell } from "../../../../../components/ui/ModalShell.js";
import type {
  MarketEvent,
  MarketEventScope,
} from "../../../../../types/models/marketEvent.types.js";
import type { MarketCategory } from "../../../../../types/models/marketCategory.types.js";
import type { MarketEventTemplate } from "../../../../../types/models/marketEventTemplate.types.js";
import {
  applyTemplateScopeToMarketEventValues,
  marketEventCreateDefaults,
  validateMarketEventForm,
  type MarketEventFormValues,
  type ValidMarketEventValues,
} from "../marketEventValidation.js";
import { toDateTimeLocal } from "../marketEventDateTime.js";
import { getMarketEventAuditReason } from "../marketEventAudit.js";

type MarketEventModalFormProps = {
  mode: "create" | "edit" | "supersede";
  event?: MarketEvent;
  templates: MarketEventTemplate[];
  categories: MarketCategory[];
  actionError?: string | null;
  submitting?: boolean;
  onCancel: () => void;
  onCancelEvent?: (reason: string) => void;
  onSave: (values: ValidMarketEventValues) => void;
};

const fieldClass =
  "h-10 w-full rounded-md border border-primary-300 bg-primary-500 px-3 text-default outline-none focus:border-primary-100 disabled:cursor-not-allowed disabled:text-muted";
const checkboxClass =
  "h-4 w-4 rounded border-primary-300 bg-primary-500 text-primary-300";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-muted";
const checkboxLabelClass =
  "flex items-center gap-2 text-sm font-medium text-muted";
const errorClass = "text-sm text-red-400";

const scopes: MarketEventScope[] = ["ITEM", "ITEM_SET", "CATEGORY", "MARKET_WIDE"];

function toFormValues(event?: MarketEvent): MarketEventFormValues {
  if (!event) {
    return marketEventCreateDefaults;
  }

  return {
    templateId: event.templateId,
    scope: event.scope,
    selectedCategoryId: event.selectedCategoryId ?? "",
    selectedItemIds: event.selectedItemIds ?? "",
    effectBasisPoints: String(event.effectBasisPoints),
    blocking: event.blocking,
    durationSeconds: "",
    endsAt: toDateTimeLocal(event.endsAt),
    reason: "",
  };
}

type TextFieldProps = {
  name: keyof MarketEventFormValues;
  label: string;
  type?: "text" | "number" | "datetime-local";
  values: MarketEventFormValues;
  errors: Partial<Record<keyof MarketEventFormValues, string>>;
  onChange: (key: keyof MarketEventFormValues, value: string) => void;
};

function TextField({
  name,
  label,
  type = "text",
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
        type={type}
        value={String(values[name])}
        onChange={(event) => onChange(name, event.target.value)}
      />
      {errors[name] ? <span className={errorClass}>{errors[name]}</span> : null}
    </label>
  );
}

export function MarketEventModalForm({
  mode,
  event,
  templates,
  categories,
  actionError = null,
  submitting = false,
  onCancel,
  onCancelEvent,
  onSave,
}: MarketEventModalFormProps) {
  const [values, setValues] = useState<MarketEventFormValues>(() =>
    toFormValues(event),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof MarketEventFormValues, string>>
  >({});

  const updateValue = (key: keyof MarketEventFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateTemplateId = (templateId: string) => {
    setValues((current) =>
      applyTemplateScopeToMarketEventValues(
        {
          ...current,
          templateId,
          scope: "",
        },
        templates,
      ),
    );
  };

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    const result = validateMarketEventForm(
      mode === "edit"
        ? values
        : applyTemplateScopeToMarketEventValues(values, templates),
    );

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSave(result.values);
  };

  const selectedTemplate = templates.find(
    (template) => template.templateId === values.templateId,
  );
  const selectedScope = mode === "edit" ? values.scope : selectedTemplate?.scope ?? "";

  return (
    <ModalShell
      title={
        mode === "edit"
          ? "Edit Market Event"
          : mode === "supersede"
            ? "Supersede Active Event"
            : "Create Market Event"
      }
      onClose={onCancel}
      footer={
        <>
          {mode === "edit" && event?.status === "ACTIVE" && onCancelEvent ? (
            <button
              className="rounded-md border border-red-400 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-500/10"
              disabled={submitting}
              type="button"
              onClick={() => onCancelEvent(values.reason)}
            >
              Cancel Market Event
            </button>
          ) : null}
          <button
            className="rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-default hover:bg-primary-400"
            disabled={submitting}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            disabled={submitting}
            form="market-event-modal-form"
            type="submit"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <form
        className="max-h-[70vh] space-y-4 overflow-y-auto pr-1"
        id="market-event-modal-form"
        onSubmit={handleSubmit}
      >
        {actionError ? <p className={errorClass}>{actionError}</p> : null}
        {mode === "supersede" ? (
          <p className="rounded-md border border-amber-300/50 bg-amber-400/10 p-3 text-sm text-amber-100">
            This ends the active event with API-owned SUPERSEDED semantics and
            starts the replacement event. The API selects the active event.
          </p>
        ) : null}
        {mode !== "edit" ? (
          <>
            <label className={labelClass}>
              Template ID
              <select
                className={fieldClass}
                name="templateId"
                value={values.templateId}
                onChange={(templateEvent) => updateTemplateId(templateEvent.target.value)}
              >
                <option value="">Select template</option>
                {templates.map((template) => (
                  <option key={template.templateId} value={template.templateId}>
                    {template.playerFacingName} ({template.templateId})
                  </option>
                ))}
              </select>
              {errors.templateId ? (
                <span className={errorClass}>{errors.templateId}</span>
              ) : null}
            </label>
            <label className={labelClass}>
              Scope
              <select
                className={fieldClass}
                disabled
                name="scope"
                value={selectedScope}
              >
                <option value="">Select scope</option>
                {scopes.map((scope) => (
                  <option key={scope} value={scope}>
                    {scope}
                  </option>
                ))}
              </select>
              {errors.scope ? (
                <span className={errorClass}>{errors.scope}</span>
              ) : null}
            </label>
            {selectedScope === "CATEGORY" ? (
              <label className={labelClass}>
                Selected Category ID
                <select
                  className={fieldClass}
                  name="selectedCategoryId"
                  value={values.selectedCategoryId}
                  onChange={(categoryEvent) =>
                    updateValue("selectedCategoryId", categoryEvent.target.value)
                  }
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.displayName}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {selectedScope === "ITEM" || selectedScope === "ITEM_SET" ? (
              <TextField
                name="selectedItemIds"
                label="Selected Item IDs"
                values={values}
                errors={errors}
                onChange={updateValue}
              />
            ) : null}
          </>
        ) : null}
        <TextField
          name="effectBasisPoints"
          label="Effect Basis Points"
          type="number"
          values={values}
          errors={errors}
          onChange={updateValue}
        />
        <label className={checkboxLabelClass}>
          <input
            checked={values.blocking}
            className={checkboxClass}
            name="blocking"
            type="checkbox"
            onChange={(blockingEvent) =>
              setValues((current) => ({
                ...current,
                blocking: blockingEvent.target.checked,
              }))
            }
          />
          Blocking
        </label>
        <TextField
          name="durationSeconds"
          label="Duration Seconds"
          type="number"
          values={values}
          errors={errors}
          onChange={updateValue}
        />
        {mode === "edit" ? (
          <>
            <TextField
              name="endsAt"
              label="Ends At"
              type="datetime-local"
              values={values}
              errors={errors}
              onChange={updateValue}
            />
            <p className={labelClass}>
              Latest Audit Reason
              <span className="rounded-md border border-primary-300 bg-primary-500 px-3 py-2 text-default">
                {getMarketEventAuditReason(event?.auditMetadata ?? null)}
              </span>
            </p>
          </>
        ) : null}
        <TextField
          name="reason"
          label="Reason"
          values={values}
          errors={errors}
          onChange={updateValue}
        />
      </form>
    </ModalShell>
  );
}
