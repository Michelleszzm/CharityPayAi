"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// donor data type definition
export interface Donor {
  id: string
  walletAddress: string
  totalDonations: number
  donationCount: number
  lastDonation: string // ISO 8601 time format
  lastAmount: number
}

// mock data - according to the design
const mockDonors: Donor[] = [
  {
    id: "1",
    walletAddress: "0xabc...123",
    totalDonations: 850.0,
    donationCount: 4,
    lastDonation: "2025-10-09T09:24:33Z",
    lastAmount: 200.0
  },
  {
    id: "2",
    walletAddress: "0xdef...456",
    totalDonations: 830.0,
    donationCount: 3,
    lastDonation: "2025-10-07T12:34:27Z",
    lastAmount: 30.0
  },
  {
    id: "3",
    walletAddress: "0xghi...789",
    totalDonations: 600.0,
    donationCount: 1,
    lastDonation: "2025-10-08T12:53:16Z",
    lastAmount: 600.0
  },
  {
    id: "4",
    walletAddress: "0xjkl...012",
    totalDonations: 580.0,
    donationCount: 2,
    lastDonation: "2025-10-07T14:11:25Z",
    lastAmount: 100.0
  },
  {
    id: "5",
    walletAddress: "0xmno...345",
    totalDonations: 470.0,
    donationCount: 1,
    lastDonation: "2025-10-09T09:24:25Z",
    lastAmount: 470.0
  },
  {
    id: "6",
    walletAddress: "0xpqr...678",
    totalDonations: 430.0,
    donationCount: 1,
    lastDonation: "2025-10-05T20:12:56Z",
    lastAmount: 430.0
  },
  {
    id: "7",
    walletAddress: "0xstu...901",
    totalDonations: 400.0,
    donationCount: 1,
    lastDonation: "2025-10-07T16:17:09Z",
    lastAmount: 400.0
  },
  {
    id: "8",
    walletAddress: "0xvwx...234",
    totalDonations: 390.0,
    donationCount: 2,
    lastDonation: "2025-10-02T10:18:24Z",
    lastAmount: 200.0
  },
  {
    id: "9",
    walletAddress: "0xyz...567",
    totalDonations: 350.0,
    donationCount: 1,
    lastDonation: "2025-10-01T09:25:17Z",
    lastAmount: 350.0
  },
  {
    id: "10",
    walletAddress: "0xaaa...890",
    totalDonations: 330.0,
    donationCount: 1,
    lastDonation: "2025-10-03T12:24:26Z",
    lastAmount: 330.0
  }
]

export default function DonorList() {
  const [walletAddress, setWalletAddress] = useState("")
  const [amountRange, setAmountRange] = useState("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [currentPage, setCurrentPage] = useState(1)

  // format time display
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

  // format amount display
  const formatAmount = (amount: number) => {
    return `$ ${amount.toFixed(2)}`
  }

  // table column definition
  const columns = useMemo<ColumnDef<Donor>[]>(
    () => [
      {
        accessorKey: "walletAddress",
        header: "Wallet Address",
        cell: ({ row }) => (
          <div className="font-normal">{row.original.walletAddress}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "totalDonations",
        header: ({ column }) => {
          return (
            <button
              className="flex cursor-pointer items-center gap-1 hover:text-[#020328]/80"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Total Donations (USD)
              <ArrowUpDown className="size-4" />
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-normal">
            {formatAmount(row.original.totalDonations)}
          </div>
        )
      },
      {
        accessorKey: "donationCount",
        header: ({ column }) => {
          return (
            <button
              className="flex cursor-pointer items-center gap-1 hover:text-[#020328]/80"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Donation Count
              <ArrowUpDown className="size-4" />
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="mr-4 text-center font-normal">
            {row.original.donationCount}
          </div>
        )
      },
      {
        accessorKey: "lastDonation",
        header: "Last Donation",
        cell: ({ row }) => (
          <div className="font-normal">
            {formatDate(row.original.lastDonation)}
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "lastAmount",
        header: "Last Amount (USD)",
        cell: ({ row }) => (
          <div className="font-normal">
            {formatAmount(row.original.lastAmount)}
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
              View
            </button>
            <button className="text-[14px] font-normal text-[#1890FF] hover:underline">
              Edit
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
    data: mockDonors,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10 // 10 data per page
      }
    }
  })

  // search processing function
  const handleSearch = () => {
    console.log("search parameters:", { walletAddress, amountRange })
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
        {/* Wallet Address input box */}
        <Input
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
          className="h-10 w-[200px] rounded-[8px] border-[#E9E9E9] text-[14px] placeholder:text-[#020328]/30"
        />

        {/* Amount Range selector */}
        <Select value={amountRange} onValueChange={setAmountRange}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Amount Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Amount Range
            </SelectItem>
            <SelectItem value="0-200" className="cursor-pointer">
              $0 - 200
            </SelectItem>
            <SelectItem value="200-500" className="cursor-pointer">
              $200 - 500
            </SelectItem>
            <SelectItem value="500-1000" className="cursor-pointer">
              $500 - 1000
            </SelectItem>
            <SelectItem value="1000+" className="cursor-pointer">
              $1000+
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="h-10 w-[82px] cursor-pointer rounded-[8px] bg-[#FE5827] text-[14px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          Search
        </button>
      </div>
      <div className="mt-8 flex items-center gap-12">
        <div className="text-[14px] leading-[18px] text-[#020328]/65">
          Donors: <span className="font-bold text-[#FE5827]">887</span>
        </div>
        <div className="text-[14px] leading-[18px] text-[#020328]/65">
          Total Donations:
          <span className="font-bold text-[#FE5827]"> $157,456</span>
        </div>
        <div className="text-[14px] leading-[18px] text-[#020328]/65">
          Donation Count:
          <span className="font-bold text-[#FE5827]"> 1,323</span>
        </div>
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
        total={890} // mock total 890 data (89 pages × 10 data per page)
        pageSize={10}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
