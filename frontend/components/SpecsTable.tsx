type SpecsTableProps = {
  specs: Record<string, any>;
};

export default function SpecsTable({ specs }: SpecsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full border-collapse">
        <tbody>
          {Object.entries(specs).map(([key, value]) => (
            <tr key={key} className="border-b last:border-b-0">
              <td className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 w-1/3">
                {key}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
