import React from "react";
import { Props } from "payload/dist/admin/components/elements/Table/types";
import { useTableColumns } from "payload/dist/admin/components/elements/TableColumns";
import { useConfig } from "payload/components/utilities";
import "payload/dist/admin/components/elements/Table/index.scss";

const baseClass = "table";

export const Table: React.FC<Props> = ({ data, columns: columnsFromProps }) => {
  const { columns: columnsFromContext } = useTableColumns();

  const columns = columnsFromProps || columnsFromContext;

  const activeColumns = columns?.filter((col) => {
    if (col.active && col.name !== "batch" && col.name !== 'status') return col;
  });

  if (!activeColumns || activeColumns.length === 0) {
    return <div>No columns selected</div>;
  }

  return (
    <div className={baseClass}>
      <table cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            {activeColumns.map((col, i) => (
              <th key={i} id={`heading-${col.accessor}`}>
                {col.components.Heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={`row-${rowIndex + 1}`}>
                {columns.map((col, colIndex) => {
                  const { active } = col;

                  if (!active || col.name === 'batch' || col.name === 'status') return null;

                  return (
                    <td key={colIndex} className={`cell-${col.accessor}`}>
                      {col.components.renderCell(row, row[col.accessor])}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
