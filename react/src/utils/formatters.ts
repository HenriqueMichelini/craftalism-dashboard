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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  },

  number: (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  },
};
