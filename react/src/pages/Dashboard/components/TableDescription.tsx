type TableDescriptionProps = {
  title: string;
  description: string;
};

function TableDescription({ title, description }: TableDescriptionProps) {
  return (
    <div className="w-full space-y-1">
      <h1 className="text-table_title text-default">{title}</h1>
      <p className="w-full md:w-2/3 lg:w-1/2">{description}</p>
    </div>
  );
}

export default TableDescription;
