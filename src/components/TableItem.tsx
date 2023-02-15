import React from 'react'

export interface TableItemProps {
    SourceFile: string;
    GPSLongitude: string;
    GPSLatitude: string;
    DateTimeOriginal: string;
    target?: string;
  }
  
export const TableItem = ({ item }: { item: TableItemProps }) => {
    const { SourceFile, GPSLatitude, GPSLongitude, DateTimeOriginal, target } =
      item;
    return (
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {SourceFile}
        </th>
        <td className="px-6 py-4">{GPSLatitude}</td>
        <td className="px-6 py-4">{GPSLongitude}</td>
        <td className="px-6 py-4">{DateTimeOriginal}</td>
        <td className="px-6 py-4">{target || "null"}</td>
      </tr>
    );
  };