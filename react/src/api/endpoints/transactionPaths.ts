export function getTransactionDetailEndpoint(id: string): string {
  return `/api/transactions/${id}`;
}

export function getTransactionsByToUuidEndpoint(uuid: string): string {
  return `/api/transactions/to/${uuid}`;
}

export function getTransactionsByFromUuidEndpoint(uuid: string): string {
  return `/api/transactions/from/${uuid}`;
}
