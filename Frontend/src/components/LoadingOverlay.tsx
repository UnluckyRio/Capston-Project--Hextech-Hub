


type LoadingOverlayProps = {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  label?: string; 
};

export default function LoadingOverlay({
  loading,
  error,
  onRetry,
  label = "Caricamento in corso…",
}: LoadingOverlayProps) {
  if (!loading && !error) return null;

  return (
    <div
      className="loading-overlay"
      role="status"
      aria-live="polite"
      aria-busy={loading}
    >
      <div className="loading-surface" aria-label={label}>
        {loading && (
          <>
            
            <div className="spinner-ring" aria-hidden="true" />
            <p className="loading-label">{label}</p>
          </>
        )}
        {!loading && error && (
          <div className="loading-error" role="alert">
            <p>Si è verificato un problema: {error}</p>
            {onRetry && (
              <button type="button" className="btn btn-primary" onClick={onRetry}>
                Riprova
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}