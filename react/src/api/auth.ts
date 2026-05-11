let apiReadToken: string | null = null;

export function setApiReadToken(token: string): void {
  const trimmedToken = token.trim();
  apiReadToken = trimmedToken ? trimmedToken : null;
}

export function clearApiReadToken(): void {
  apiReadToken = null;
}

export function hasApiReadToken(): boolean {
  return apiReadToken !== null;
}

export function getApiAuthorizationHeader(): string | undefined {
  if (!apiReadToken) {
    return undefined;
  }

  return apiReadToken.toLowerCase().startsWith("bearer ")
    ? apiReadToken
    : `Bearer ${apiReadToken}`;
}
