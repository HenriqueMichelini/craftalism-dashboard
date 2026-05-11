import { useState } from "react";
import type { FormEvent } from "react";
import {
  clearApiReadToken,
  hasApiReadToken,
  setApiReadToken,
} from "../../../api/auth.js";

type ApiReadTokenControlProps = {
  onTokenChange: () => void;
};

export function ApiReadTokenControl({
  onTokenChange,
}: ApiReadTokenControlProps) {
  const [token, setToken] = useState("");
  const [configured, setConfigured] = useState(hasApiReadToken());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiReadToken(token);
    setConfigured(hasApiReadToken());
    setToken("");
    onTokenChange();
  };

  const handleClear = () => {
    clearApiReadToken();
    setConfigured(false);
    setToken("");
    onTokenChange();
  };

  return (
    <form
      aria-label="API read token"
      className="mb-4 flex flex-col gap-2 rounded-lg border border-primary-400 bg-primary-500 p-3 sm:flex-row sm:items-center"
      onSubmit={handleSubmit}
    >
      <label
        className="text-xs font-semibold uppercase tracking-wide text-muted"
        htmlFor="api-read-token"
      >
        API read token
      </label>
      <input
        autoComplete="off"
        className="min-w-0 flex-1 rounded-md border border-primary-400 bg-primary-300 px-3 py-2 text-sm text-default outline-none focus:border-primary-200"
        id="api-read-token"
        onChange={(event) => setToken(event.target.value)}
        placeholder={configured ? "Read token configured" : "Paste api:read token"}
        type="password"
        value={token}
      />
      <button
        className="rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
        type="submit"
      >
        Save
      </button>
      <button
        className="rounded-md border border-primary-400 px-4 py-2 text-sm font-medium text-muted hover:text-default"
        disabled={!configured && !token}
        onClick={handleClear}
        type="button"
      >
        Clear
      </button>
    </form>
  );
}
