import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <h1 className="text-table_title text-default">{title}</h1>
        {description && (
          <p className="w-full text-muted md:w-2/3 lg:w-1/2">{description}</p>
        )}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
