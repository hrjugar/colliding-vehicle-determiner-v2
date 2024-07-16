import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface AccidentTableRow {
  imgSrc: string;
  name: string;
  collidingVehicle: 0 | 1 | 2;
  dateCreated: string;
}

const defaultData: AccidentTableRow[] = [
  {
    imgSrc: '',
    name: "Accident 1",
    collidingVehicle: 1,
    dateCreated: "4 hours ago"
  },
  {
    imgSrc: '',
    name: "Sad Accident",
    collidingVehicle: 1,
    dateCreated: "3 hours ago"
  },
  {
    imgSrc: '',
    name: "True Accident",
    collidingVehicle: 2,
    dateCreated: "2 hours ago"
  },
  {
    imgSrc: '',
    name: "False Accident",
    collidingVehicle: 0,
    dateCreated: "1 minute ago"
  }
];

export default function AccidentTable() {
  const [data, setData] = useState<AccidentTableRow[]>(defaultData);

  const columnHelper = createColumnHelper<AccidentTableRow>();

  const columns = useMemo(() => [
    columnHelper.group({
      header: 'Name',
      columns: [
        columnHelper.accessor('imgSrc', {
          cell: (info) => (
            <img src={info.getValue()} />
          )
        }),
        columnHelper.accessor('name', {
          cell: (info) => (
            <span className="font-semibold">{info.getValue()}</span>
          )
        })
      ]
    }),
    columnHelper.accessor('collidingVehicle', {
      header: 'Has Collision',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('dateCreated', {
      header: 'Created',
      cell: (info) => info.getValue()
    })
  ], []);


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      Accident Table
    </div>
  )
}