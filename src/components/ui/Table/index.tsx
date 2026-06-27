type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  counterInfo?: string;
};

function Table<T>({ columns, data, counterInfo }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      {counterInfo && <p className="text-text/70 mb-2">{counterInfo}</p>}
      <table className="w-full rounded-md overflow-hidden">
        <thead className="bg-primary/10">
          <tr className="border-0">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`text-left p-3 text-xs font-semibold text-text/80 sm:text-sm ${index === columns.length - 1 ? "text-right" : ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-4 text-text"
              >
                Nenhum registro encontrado
              </td>
            </tr>
          )}

          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className=" border-t border-primary/20 bg-light hover:bg-gray-50 transition-colors"
            >
              {columns.map((col, colIndex) => {
                const value = row[col.accessor];

                return (
                  <td key={colIndex} className={`p-3 text-xs sm:text-sm ${colIndex === columns.length - 1 ? "text-right" : ""}`}>
                    {col.render
                      ? col.render(value, row)
                      : String(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;