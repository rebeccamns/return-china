type DetailField = {
  label: string;
  value: string;
};

export default function DetailFields({ fields }: { fields: DetailField[] }) {
  return (
    <dl className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <div key={field.label} className="min-w-0">
          <dt className="text-xs text-text-colortext-gray">{field.label}</dt>
          <dd
            title={field.value}
            className="truncate text-sm font-medium text-black"
          >
            {field.value || "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
