export const AMOUNT_SCALE =
  Number((import.meta as ImportMeta & { env?: { VITE_AMOUNT_SCALE?: string } }).env?.VITE_AMOUNT_SCALE) ||
  10000;

export function toApiAmount(value: string | undefined): string | undefined {
  if (!value || value.trim().length === 0) {
    return undefined;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return value;
  }

  return String(Math.round(numericValue * AMOUNT_SCALE));
}

export const formatters = {
  date: (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  shortDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  },

  currency: (value: number, currency = "USD") => {
    if (value == null) return "-";

    const normalizedValue = value / AMOUNT_SCALE;

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(normalizedValue);
    } catch {
      return `${new Intl.NumberFormat("en-US").format(normalizedValue)} ${currency}`;
    }
  },

  number: (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  },
};
