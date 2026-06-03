import { useRef, useState } from "react";
import { marketEventTemplatesApi } from "../../../../api/endpoints/marketEventTemplates.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { useTableData } from "../../../../hooks/useTableData.js";
import type {
  MarketEventTemplate,
  MarketEventTemplateCreateRequest,
  MarketEventTemplateUpdateRequest,
} from "../../../../types/models/marketEventTemplate.types.js";
import { submitMarketEventTemplateSave } from "./marketEventTemplateActions.js";
import {
  prependMarketEventTemplateRow,
  replaceMarketEventTemplateRow,
} from "./marketEventTemplateRows.js";
import { MarketEventTemplateModalForm } from "./components/MarketEventTemplateModalForm.js";
import { MarketEventTemplateTable } from "./components/MarketEventTemplateTable.js";

export function MarketEventTemplatesView() {
  const { data, loading, error, refetch, setData } = useTableData(marketEventTemplatesApi.getAll);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<MarketEventTemplate | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [submitting, setSubmittingState] = useState(false);
  const submittingRef = useRef(false);

  const setSubmitting = (value: boolean) => {
    submittingRef.current = value;
    setSubmittingState(value);
  };
  const closeModal = () => {
    setMutationError(null);
    setEditingTemplate(null);
    setModalOpen(false);
  };
  const openCreateModal = () => {
    setMutationError(null);
    setEditingTemplate(null);
    setModalOpen(true);
  };
  const openEditModal = (template: MarketEventTemplate) => {
    setMutationError(null);
    setEditingTemplate(template);
    setModalOpen(true);
  };
  const handleSave = async (
    request: MarketEventTemplateCreateRequest | MarketEventTemplateUpdateRequest,
  ) => {
    const templateBeingEdited = editingTemplate;

    await submitMarketEventTemplateSave({
      isSubmitting: () => submittingRef.current,
      save: () =>
        templateBeingEdited
          ? marketEventTemplatesApi.update(
              templateBeingEdited.templateId,
              request as MarketEventTemplateUpdateRequest,
            )
          : marketEventTemplatesApi.create(
              request as MarketEventTemplateCreateRequest,
            ),
      applyRow: (template) =>
        setData((rows) =>
          templateBeingEdited
            ? replaceMarketEventTemplateRow(rows, template)
            : prependMarketEventTemplateRow(rows, template),
        ),
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
        action={<button className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300" type="button" onClick={openCreateModal}>Add Market Event Template</button>}
      />
      <MarketEventTemplateTable data={data} loading={loading} error={error} onRetry={refetch} onEdit={openEditModal} />
      {modalOpen ? (
        <MarketEventTemplateModalForm
          actionError={mutationError}
          initialTemplate={editingTemplate}
          mode={editingTemplate ? "edit" : "create"}
          submitting={submitting}
          onCancel={closeModal}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
