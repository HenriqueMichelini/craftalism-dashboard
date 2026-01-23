type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h1 className="text-table_title text-default">{title}</h1>
        {description && (
          <p className="w-full text-muted md:w-2/3 lg:w-1/2">{description}</p>
        )}
      </div>
    </div>
  );
}
