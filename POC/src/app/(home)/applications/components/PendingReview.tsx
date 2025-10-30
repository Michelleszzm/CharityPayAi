"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef
} from "@tanstack/react-table"

// application data type definition
export interface Application {
  id: string
  email: string
  nonprofit: string
  proof: string // proof file link
  name: string
  applicationDate: string // ISO 8601 time format
}

// mock data - generated based on design
const mockApplications: Application[] = [
  {
    id: "1",
    email: "alice@example.org",
    nonprofit: "Green Earth Foundation",
    proof: "/proofs/green-earth.pdf",
    name: "Alice Johnson",
    applicationDate: "2025-10-09T09:24:33Z"
  },
  {
    id: "2",
    email: "bob@example.org",
    nonprofit: "Helping Hands Initiative",
    proof: "/proofs/helping-hands.pdf",
    name: "Bob Smith",
    applicationDate: "2025-10-07T12:34:27Z"
  },
  {
    id: "3",
    email: "carol@example.org",
    nonprofit: "Bright Future Charity",
    proof: "/proofs/bright-future.pdf",
    name: "Carol Davis",
    applicationDate: "2025-10-03T12:53:16Z"
  },
  {
    id: "4",
    email: "dave@example.org",
    nonprofit: "Ocean Cleaners",
    proof: "/proofs/ocean-cleaners.pdf",
    name: "Dave Wilson",
    applicationDate: "2025-10-01T14:11:25Z"
  },
  {
    id: "5",
    email: "eve@example.org",
    nonprofit: "Children First Foundation",
    proof: "/proofs/children-first.pdf",
    name: "Eve Thompson",
    applicationDate: "2025-09-23T09:24:25Z"
  },
  {
    id: "6",
    email: "frank@example.org",
    nonprofit: "Health & Hope",
    proof: "/proofs/health-hope.pdf",
    name: "Frank Martinez",
    applicationDate: "2025-09-18T20:12:56Z"
  },
  {
    id: "7",
    email: "grace@example.org",
    nonprofit: "Literacy For All",
    proof: "/proofs/literacy-all.pdf",
    name: "Grace Lee",
    applicationDate: "2025-09-17T16:17:09Z"
  },
  {
    id: "8",
    email: "helen@example.org",
    nonprofit: "Animal Care Society",
    proof: "/proofs/animal-care.pdf",
    name: "Helen Clark",
    applicationDate: "2025-09-02T10:18:24Z"
  },
  {
    id: "9",
    email: "ian@example.org",
    nonprofit: "Global Relief Network",
    proof: "/proofs/global-relief.pdf",
    name: "Ian Lewis",
    applicationDate: "2025-08-15T09:25:17Z"
  },
  {
    id: "10",
    email: "jane@example.org",
    nonprofit: "Sunshine Community Fund",
    proof: "/proofs/sunshine-fund.pdf",
    name: "Jane Walker",
    applicationDate: "2025-08-12T12:24:26Z"
  }
]

export default function PendingReview() {
  const [email, setEmail] = useState("")
  const [nonprofit, setNonprofit] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // format date display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      })
      .replace(/\//g, "-")
  }

  // table column definition
  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.email}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "nonprofit",
        header: "Nonprofit",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.nonprofit}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "proof",
        header: "Proof",
        cell: ({ row }) => (
          <button className="text-[14px] font-normal text-[#1890FF] hover:underline">
            View
          </button>
        ),
        enableSorting: false
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.name}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "applicationDate",
        header: "Application Date",
        cell: ({ row }) => (
          <div className="font-normal">
            {formatDate(row.original.applicationDate)}
          </div>
        ),
        enableSorting: false
      },
      {
        id: "actions",
        header: () => (
          <button className="flex w-full items-center justify-center">
            Actions
          </button>
        ),
        cell: () => (
          <div className="flex w-full items-center justify-center gap-4">
            <button className="text-[14px] font-normal text-[#1890FF] hover:underline">
              Approved
            </button>
            <button className="text-[14px] font-normal text-[#1890FF] hover:underline">
              Delete
            </button>
          </div>
        ),
        enableSorting: false
      }
    ],
    []
  )

  // TanStack React Table instance
  const table = useReactTable({
    data: mockApplications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10 // 10 data per page
      }
    }
  })

  // search processing function
  const handleSearch = () => {
    console.log("search parameters:", { email, nonprofit })
    // TODO: here can be integrated with actual search API
  }

  // pagination processing function
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    table.setPageIndex(page - 1) // TanStack table page index starts from 0
  }

  return (
    <div>
      {/* search filter bar */}
      <div className="flex items-center gap-4">
        {/* email input box */}
        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="h-10 w-[200px] rounded-[8px] border-[#E9E9E9] text-[14px] placeholder:text-[#020328]/30"
        />

        {/* nonprofit input box */}
        <Input
          placeholder="Nonprofit"
          value={nonprofit}
          onChange={e => setNonprofit(e.target.value)}
          className="h-10 w-[200px] rounded-[8px] border-[#E9E9E9] text-[14px] placeholder:text-[#020328]/30"
        />

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="h-10 w-[82px] cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          Search
        </button>
      </div>

      {/* data table */}
      <div className="mt-4 border border-[#E9E9E9]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-[#E9E9E9] bg-[#F9F9F9] hover:bg-[#F9F9F9]"
              >
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="h-[52px] px-6 text-[14px] font-medium text-[#020328]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className="border-b border-[#E9E9E9] hover:bg-[#F9F9F9]/50"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 text-[14px] !text-[#020328]/65"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  no data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        total={20} // mock total 20 data (10 pages × 10 data per page)
        pageSize={10}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
