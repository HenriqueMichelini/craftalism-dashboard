export const MISSING_MARKET_EVENT_AUDIT_REASON = "Not provided";

export function getMarketEventAuditReason(
  auditMetadata: string | null,
): string {
  if (!auditMetadata) {
    return MISSING_MARKET_EVENT_AUDIT_REASON;
  }

  try {
    const metadata: unknown = JSON.parse(auditMetadata);

    if (
      typeof metadata === "object" &&
      metadata !== null &&
      "reason" in metadata &&
      typeof metadata.reason === "string" &&
      metadata.reason.trim()
    ) {
      return metadata.reason.trim();
    }
  } catch {
    return MISSING_MARKET_EVENT_AUDIT_REASON;
  }

  return MISSING_MARKET_EVENT_AUDIT_REASON;
}
