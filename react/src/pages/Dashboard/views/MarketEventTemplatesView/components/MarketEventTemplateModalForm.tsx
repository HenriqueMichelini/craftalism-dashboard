import { useState } from "react";
import type { FormEvent } from "react";
import { ModalShell } from "../../../../../components/ui/ModalShell.js";
import type { MarketEventScope } from "../../../../../types/models/marketEvent.types.js";
import type {
  MarketEventTemplate,
  MarketEventTemplateCreateRequest,
  MarketEventTemplateUpdateRequest,
} from "../../../../../types/models/marketEventTemplate.types.js";
import {
  marketEventTemplateCreateDefaults,
  toMarketEventTemplateFormValues,
  validateMarketEventTemplateForm,
  type MarketEventTemplateFormValues,
} from "../marketEventTemplateValidation.js";

type MarketEventTemplateModalMode = "create" | "edit";

type MarketEventTemplateModalFormProps = {
  actionError?: string | null;
  initialTemplate?: MarketEventTemplate | null;
  mode?: MarketEventTemplateModalMode;
  submitting?: boolean;
  onCancel: () => void;
  onSave: (
    request: MarketEventTemplateCreateRequest | MarketEventTemplateUpdateRequest,
  ) => void;
};

const fieldClass =
  "h-10 w-full rounded-md border border-primary-300 bg-primary-500 px-3 text-default outline-none focus:border-primary-100";
const areaClass =
  "min-h-24 w-full rounded-md border border-primary-300 bg-primary-500 px-3 py-2 text-default outline-none focus:border-primary-100";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-muted";
const checkboxLabelClass = "flex items-center gap-2 text-sm font-medium text-muted";
const errorClass = "text-sm text-red-400";
const scopes: MarketEventScope[] = ["ITEM", "ITEM_SET", "CATEGORY", "MARKET_WIDE"];

type TextFieldProps = {
  name: keyof MarketEventTemplateFormValues;
  label: string;
  type?: "text" | "number";
  disabled?: boolean;
  values: MarketEventTemplateFormValues;
  errors: Partial<Record<keyof MarketEventTemplateFormValues, string>>;
  onChange: (key: keyof MarketEventTemplateFormValues, value: string) => void;
};

function TextField({
  name,
  label,
  type = "text",
  disabled = false,
  values,
  errors,
  onChange,
}: TextFieldProps) {
  return (
    <label className={labelClass}>
      {label}
      <input
        className={fieldClass}
        disabled={disabled}
        name={name}
        type={type}
        value={String(values[name])}
        onChange={(event) => onChange(name, event.target.value)}
      />
      {errors[name] ? <span className={errorClass}>{errors[name]}</span> : null}
    </label>
  );
}

export function MarketEventTemplateModalForm({
  actionError = null,
  initialTemplate = null,
  mode = "create",
  submitting = false,
  onCancel,
  onSave,
}: MarketEventTemplateModalFormProps) {
  const isEditMode = mode === "edit";
  const [values, setValues] = useState(() =>
    initialTemplate
      ? toMarketEventTemplateFormValues(initialTemplate)
      : marketEventTemplateCreateDefaults,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof MarketEventTemplateFormValues, string>>
  >({});

  const updateValue = (key: keyof MarketEventTemplateFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateMarketEventTemplateForm(values, {
      includeTemplateId: !isEditMode,
    });

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSave(result.request);
  };

  return (
    <ModalShell
      title={isEditMode ? "Edit Market Event Template" : "Create Market Event Template"}
      onClose={onCancel}
      footer={
        <>
          <button className="rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-default hover:bg-primary-400" disabled={submitting} type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300" disabled={submitting} form="market-event-template-modal-form" type="submit">
            {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Save"}
          </button>
        </>
      }
    >
      <form className="max-h-[70vh] space-y-4 overflow-y-auto pr-1" id="market-event-template-modal-form" onSubmit={handleSubmit}>
        {actionError ? <p className={errorClass}>{actionError}</p> : null}
        <TextField name="templateId" label="Template ID" disabled={isEditMode} values={values} errors={errors} onChange={updateValue} />
        <label className={labelClass}>
          Scope
          <select className={fieldClass} name="scope" value={values.scope} onChange={(event) => updateValue("scope", event.target.value)}>
            <option value="">Select scope</option>
            {scopes.map((scope) => <option key={scope}>{scope}</option>)}
          </select>
          {errors.scope ? <span className={errorClass}>{errors.scope}</span> : null}
        </label>
        <TextField name="automaticWeight" label="Automatic Weight" type="number" values={values} errors={errors} onChange={updateValue} />
        <label className={checkboxLabelClass}><input checked={values.automaticEnabled} name="automaticEnabled" type="checkbox" onChange={(event) => setValues((current) => ({ ...current, automaticEnabled: event.target.checked }))} /> Automatic Enabled</label>
        <label className={checkboxLabelClass}><input checked={values.blockingAllowed} name="blockingAllowed" type="checkbox" onChange={(event) => setValues((current) => ({ ...current, blockingAllowed: event.target.checked }))} /> Blocking Allowed</label>
        <TextField name="minDurationSeconds" label="Minimum Duration Seconds" type="number" values={values} errors={errors} onChange={updateValue} />
        <TextField name="maxDurationSeconds" label="Maximum Duration Seconds" type="number" values={values} errors={errors} onChange={updateValue} />
        <TextField name="minEffectBasisPoints" label="Minimum Effect Basis Points" type="number" values={values} errors={errors} onChange={updateValue} />
        <TextField name="maxEffectBasisPoints" label="Maximum Effect Basis Points" type="number" values={values} errors={errors} onChange={updateValue} />
        <TextField name="cooldownSeconds" label="Cooldown Seconds" type="number" values={values} errors={errors} onChange={updateValue} />
        <TextField name="playerFacingName" label="Player-Facing Name" values={values} errors={errors} onChange={updateValue} />
        <label className={labelClass}>Player-Facing Description<textarea className={areaClass} name="playerFacingDescription" value={values.playerFacingDescription} onChange={(event) => updateValue("playerFacingDescription", event.target.value)} />{errors.playerFacingDescription ? <span className={errorClass}>{errors.playerFacingDescription}</span> : null}</label>
        <TextField name="broadScopeHint" label="Broad Scope Hint" values={values} errors={errors} onChange={updateValue} />
        <label className={labelClass}>Eligible Target Metadata JSON<textarea className={areaClass} name="eligibleTargetMetadata" value={values.eligibleTargetMetadata} onChange={(event) => updateValue("eligibleTargetMetadata", event.target.value)} />{errors.eligibleTargetMetadata ? <span className={errorClass}>{errors.eligibleTargetMetadata}</span> : null}</label>
      </form>
    </ModalShell>
  );
}
