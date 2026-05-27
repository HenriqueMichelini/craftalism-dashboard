import { useState } from "react";
import { marketCategoriesApi } from "../../../../api/endpoints/marketCategories.js";
import { PageHeader } from "../../../../components/shared/PageHeader/PageHeader.js";
import { useTableData } from "../../../../hooks/useTableData.js";
import type { MarketCategory } from "../../../../types/models/marketCategory.types.js";
import { MarketCategoryModalForm } from "./components/MarketCategoryModalForm.js";
import { MarketCategoryTable } from "./components/MarketCategoryTable.js";
import {
  removeMarketCategoryRow,
  upsertMarketCategoryRow,
} from "./marketCategoryRows.js";
import type { ValidMarketCategoryValues } from "./marketCategoryValidation.js";

type MarketCategoryModalState =
  | { mode: "create"; category?: undefined }
  | { mode: "edit"; category: MarketCategory };

export function MarketCategoriesView() {
  const { data, loading, error, refetch, setData } = useTableData(
    marketCategoriesApi.getAll,
  );
  const [modalState, setModalState] =
    useState<MarketCategoryModalState | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => {
    setMutationError(null);
    setModalState(null);
  };

  const handleMutationError = (error: unknown, fallbackMessage: string) => {
    setMutationError(error instanceof Error ? error.message : fallbackMessage);
  };

  const handleSave = async (values: ValidMarketCategoryValues) => {
    if (!modalState) return;

    setSubmitting(true);
    setMutationError(null);

    try {
      const savedCategory =
        modalState.mode === "edit"
          ? await marketCategoriesApi.update(
              modalState.category.categoryId,
              values.updateRequest,
            )
          : await marketCategoriesApi.create(values.createRequest);
      setData((currentCategories) =>
        upsertMarketCategoryRow(currentCategories, savedCategory),
      );
      closeModal();
    } catch (error) {
      handleMutationError(error, "Failed to save market category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: MarketCategory) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Remove market category "${category.displayName}"?`)
    ) {
      return;
    }

    setSubmitting(true);
    setMutationError(null);

    try {
      await marketCategoriesApi.delete(category.categoryId);
      setData((currentCategories) =>
        removeMarketCategoryRow(currentCategories, category.categoryId),
      );
      closeModal();
    } catch (error) {
      handleMutationError(error, "Failed to remove market category.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Categories"
        description="Manage API-owned market categories used by market items."
        action={
          <button
            className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
            type="button"
            onClick={() => setModalState({ mode: "create" })}
          >
            Add Market Category
          </button>
        }
      />
      <MarketCategoryTable
        data={data}
        loading={loading}
        error={error}
        onRetry={refetch}
        onMarketCategoryClick={(category) =>
          setModalState({ mode: "edit", category })
        }
      />
      {modalState ? (
        <MarketCategoryModalForm
          mode={modalState.mode}
          category={modalState.category}
          actionError={mutationError}
          submitting={submitting}
          onCancel={closeModal}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
