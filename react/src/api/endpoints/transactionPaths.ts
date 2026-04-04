export function getTransactionsEndpoint(): string {
  return "/api/transactions";
}

export function getTransactionDetailEndpoint(id: string): string {
  return `${getTransactionsEndpoint()}/${id}`;
}

export function getTransactionsByToUuidEndpoint(uuid: string): string {
  return `${getTransactionsEndpoint()}/to/${uuid}`;
}

export function getTransactionsByFromUuidEndpoint(uuid: string): string {
  return `${getTransactionsEndpoint()}/from/${uuid}`;
}
