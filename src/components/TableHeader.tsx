import React from 'react'

export default function TableHeader() {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" className="px-6 py-3">
        Source file
      </th>
      <th scope="col" className="px-6 py-3">
        Latitude
      </th>
      <th scope="col" className="px-6 py-3">
        Longitude
      </th>
      <th scope="col" className="px-6 py-3">
        Date
      </th>
      <th scope="col" className="px-6 py-3">
        Target
      </th>
    </tr>
  </thead>  )
}