function Table() {
  return (
    <div className="overflow-hidden rounded-lg border border-primary-400">
      <table className="w-full border-collapse text-left">
        {/* Header */}
        <thead className="bg-primary-400">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              UUID
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Name
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Created at
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-primary-400 bg-primary-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="transition-colors hover:bg-primary-400/60">
              <td className="px-4 py-3 font-mono text-sm text-default">
                019b2eb8-b291-7603-9618-e7d8c149f16c
              </td>

              <td className="px-4 py-3 font-medium text-default">KOLONY_9</td>

              <td className="px-4 py-3 text-sm text-muted">
                2025-12-17 23:51:52
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
