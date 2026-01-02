type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading data...",
}: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-primary-400 bg-primary-500 p-12">
      <div className="text-center">
        <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-400 border-t-default"></div>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
}

type ErrorStateProps = {
  error: string;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-400 bg-red-500/10 p-6">
      <p className="text-red-400">Error: {error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
        >
          Retry
        </button>
      )}
    </div>
  );
}

type EmptyStateProps = {
  message?: string;
};

export function EmptyState({
  message = "No data available.",
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center text-center p-12">
      <h3 className="text-muted">{message}</h3>
    </div>
  );
}
