import { useRef, useState } from "react";
import { marketEventTemplatesApi } from "../../../../api/endpoints/marketEventTemplates.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { useTableData } from "../../../../hooks/useTableData.js";
import type { MarketEventTemplateCreateRequest } from "../../../../types/models/marketEventTemplate.types.js";
import { submitMarketEventTemplateSave } from "./marketEventTemplateActions.js";
import { prependMarketEventTemplateRow } from "./marketEventTemplateRows.js";
import { MarketEventTemplateModalForm } from "./components/MarketEventTemplateModalForm.js";
import { MarketEventTemplateTable } from "./components/MarketEventTemplateTable.js";

export function MarketEventTemplatesView() {
  const { data, loading, error, refetch, setData } = useTableData(marketEventTemplatesApi.getAll);
  const [modalOpen, setModalOpen] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [submitting, setSubmittingState] = useState(false);
  const submittingRef = useRef(false);

  const setSubmitting = (value: boolean) => {
    submittingRef.current = value;
    setSubmittingState(value);
  };
  const closeModal = () => {
    setMutationError(null);
    setModalOpen(false);
  };
  const handleSave = async (request: MarketEventTemplateCreateRequest) => {
    await submitMarketEventTemplateSave({
      isSubmitting: () => submittingRef.current,
      save: () => marketEventTemplatesApi.create(request),
      insertRow: (template) => setData((rows) => prependMarketEventTemplateRow(rows, template)),
      closeModal,
      setSubmitting,
      setError: setMutationError,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Event Templates"
        description="Inspect and author API-owned market event templates."
        action={<button className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300" type="button" onClick={() => setModalOpen(true)}>Add Market Event Template</button>}
      />
      <MarketEventTemplateTable data={data} loading={loading} error={error} onRetry={refetch} />
      {modalOpen ? <MarketEventTemplateModalForm actionError={mutationError} submitting={submitting} onCancel={closeModal} onSave={handleSave} /> : null}
    </div>
  );
}
