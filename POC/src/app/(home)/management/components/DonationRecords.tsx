"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
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

// import token icons
import ethereumIcon from "@/assets/wallet/ETH.png"
import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import daiIcon from "@/assets/wallet/DAI.png"

// donation record data type definition
export interface DonationRecord {
  id: string
  walletAddress: string
  amount: number
  date: string // ISO 8601 time format
  chain: "Ethereum" | "Solana" | "Bitcoin"
  token: "USDT" | "USDC" | "BTC" | "ETH" | "DAI" | "SOL"
  txHash: string
  riskLevel: "low" | "medium" | "high"
}

// chain and token icon mapping
const chainIcons = {
  Ethereum: ethereumIcon,
  Solana: solanaIcon,
  Bitcoin: bitcoinIcon
}

const tokenIcons = {
  USDT: usdtIcon,
  USDC: usdcIcon,
  BTC: bitcoinIcon,
  ETH: ethereumIcon,
  DAI: daiIcon,
  SOL: solanaIcon
}

// mock data - according to the design
const mockDonations: DonationRecord[] = [
  {
    id: "1",
    walletAddress: "0xabc...123",
    amount: 200.0,
    date: "2025-10-09T09:24:33Z",
    chain: "Ethereum",
    token: "USDT",
    txHash: "0x34dF...7A12",
    riskLevel: "low"
  },
  {
    id: "2",
    walletAddress: "0xdef...456",
    amount: 30.0,
    date: "2025-10-07T12:34:27Z",
    chain: "Ethereum",
    token: "USDT",
    txHash: "0xa23D...9BF0",
    riskLevel: "low"
  },
  {
    id: "3",
    walletAddress: "0xghi...789",
    amount: 50.0,
    date: "2025-10-08T12:53:16Z",
    chain: "Solana",
    token: "USDC",
    txHash: "0x8e1B...6C45",
    riskLevel: "low"
  },
  {
    id: "4",
    walletAddress: "0xjkl...012",
    amount: 100.0,
    date: "2025-10-07T14:11:25Z",
    chain: "Ethereum",
    token: "USDC",
    txHash: "0x03E9...A0F1",
    riskLevel: "low"
  },
  {
    id: "5",
    walletAddress: "0xmn0...345",
    amount: 100.0,
    date: "2025-10-09T09:24:25Z",
    chain: "Bitcoin",
    token: "BTC",
    txHash: "0xB3F2...C6Ef",
    riskLevel: "low"
  },
  {
    id: "6",
    walletAddress: "0xpqr...678",
    amount: 30.0,
    date: "2025-10-05T20:12:56Z",
    chain: "Ethereum",
    token: "DAI",
    txHash: "0xF1B9...40dE",
    riskLevel: "low"
  },
  {
    id: "7",
    walletAddress: "0xstu...901",
    amount: 50.0,
    date: "2025-10-07T16:17:09Z",
    chain: "Ethereum",
    token: "USDT",
    txHash: "0x14E4...3A28",
    riskLevel: "low"
  },
  {
    id: "8",
    walletAddress: "0xvwx...234",
    amount: 70.0,
    date: "2025-10-02T10:18:24Z",
    chain: "Solana",
    token: "USDT",
    txHash: "0x2D4D...A0C4",
    riskLevel: "low"
  },
  {
    id: "9",
    walletAddress: "0xyz...567",
    amount: 200.0,
    date: "2025-10-01T09:25:17Z",
    chain: "Ethereum",
    token: "USDC",
    txHash: "0xD6B4...63C6",
    riskLevel: "low"
  },
  {
    id: "10",
    walletAddress: "0xaaa...890",
    amount: 30.0,
    date: "2025-10-03T12:24:26Z",
    chain: "Solana",
    token: "SOL",
    txHash: "0xC37E...B9DF",
    riskLevel: "low"
  }
]

export default function DonationRecords() {
  const [walletAddress, setWalletAddress] = useState("")
  const [chain, setChain] = useState("all")
  const [token, setToken] = useState("all")
  const [amountRange, setAmountRange] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [currentPage, setCurrentPage] = useState(1)

  // format time display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      })
      .replace(/(\d+)\/(\d+)\/(\d+),/, "$3-$1-$2")
  }

  // format amount display
  const formatAmount = (amount: number) => {
    return `$ ${amount.toFixed(2)}`
  }

  // risk level text mapping
  const riskLevelText = {
    low: "Low - Safe Donation",
    medium: "Medium - Review Required",
    high: "High - Suspicious Activity"
  }

  // table column definition
  const columns = useMemo<ColumnDef<DonationRecord>[]>(
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
        accessorKey: "amount",
        header: ({ column }) => {
          return (
            <button
              className="flex cursor-pointer items-center gap-1 hover:text-[#020328]/80"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Amount (USD)
              <ArrowUpDown className="size-4" />
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-normal">{formatAmount(row.original.amount)}</div>
        )
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="font-normal">{formatDate(row.original.date)}</div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "chain",
        header: "Chain",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Image
              src={chainIcons[row.original.chain]}
              alt={row.original.chain}
              width={20}
              height={20}
              className="size-5"
            />
            <span className="font-normal">{row.original.chain}</span>
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "token",
        header: "Token",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Image
              src={tokenIcons[row.original.token]}
              alt={row.original.token}
              width={20}
              height={20}
              className="size-5"
            />
            <span className="font-normal">{row.original.token}</span>
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: "txHash",
        header: "Tx Hash",
        cell: ({ row }) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal text-[#1890FF] hover:underline"
          >
            {row.original.txHash}
          </a>
        ),
        enableSorting: false
      },
      {
        accessorKey: "riskLevel",
        header: "AI AML Risk",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full",
                row.original.riskLevel === "low" && "bg-[#00B140]",
                row.original.riskLevel === "medium" && "bg-[#FAAD14]",
                row.original.riskLevel === "high" && "bg-[#F5222D]"
              )}
            />
            <span className="font-normal">
              {riskLevelText[row.original.riskLevel]}
            </span>
          </div>
        ),
        enableSorting: false
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <button className="w-full text-center text-[14px] font-normal text-[#1890FF] hover:underline">
            View
          </button>
        ),
        enableSorting: false
      }
    ],
    []
  )

  // TanStack React Table instance
  const table = useReactTable({
    data: mockDonations,
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
    console.log("search parameters:", {
      walletAddress,
      chain,
      token,
      amountRange,
      dateRange
    })
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

        {/* Chain selector */}
        <Select value={chain} onValueChange={setChain}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Chain
            </SelectItem>
            <SelectItem value="ethereum" className="cursor-pointer">
              <Image
                src={ethereumIcon}
                alt="Ethereum"
                width={160}
                height={160}
                className="size-5"
              />
              Ethereum
            </SelectItem>
            <SelectItem value="solana" className="cursor-pointer">
              <Image
                src={solanaIcon}
                alt="Solana"
                width={160}
                height={160}
                className="size-5"
              />
              Solana
            </SelectItem>
            <SelectItem value="bitcoin" className="cursor-pointer">
              <Image
                src={bitcoinIcon}
                alt="Bitcoin"
                width={160}
                height={160}
                className="size-5"
              />
              Bitcoin
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Token selector */}
        <Select value={token} onValueChange={setToken}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Token
            </SelectItem>
            <SelectItem value="usdt" className="cursor-pointer">
              <Image
                src={usdtIcon}
                alt="USDT"
                width={160}
                height={160}
                className="size-5"
              />
              USDT
            </SelectItem>
            <SelectItem value="usdc" className="cursor-pointer">
              <Image
                src={usdcIcon}
                alt="USDC"
                width={160}
                height={160}
                className="size-5"
              />
              USDC
            </SelectItem>
            <SelectItem value="btc" className="cursor-pointer">
              <Image
                src={bitcoinIcon}
                alt="Bitcoin"
                width={160}
                height={160}
                className="size-5"
              />
              BTC
            </SelectItem>
            <SelectItem value="eth" className="cursor-pointer">
              <Image
                src={ethereumIcon}
                alt="Ethereum"
                width={160}
                height={160}
                className="size-5"
              />
              ETH
            </SelectItem>
            <SelectItem value="dai" className="cursor-pointer">
              <Image
                src={daiIcon}
                alt="DAI"
                width={160}
                height={160}
                className="size-5"
              />
              DAI
            </SelectItem>
            <SelectItem value="sol" className="cursor-pointer">
              <Image
                src={solanaIcon}
                alt="SOL"
                width={160}
                height={160}
                className="size-5"
              />
              SOL
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Amount Range selector */}
        <Select value={amountRange} onValueChange={setAmountRange}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Amount Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Amount Range
            </SelectItem>
            <SelectItem value="0-100" className="cursor-pointer">
              $0 - 100
            </SelectItem>
            <SelectItem value="100-500" className="cursor-pointer">
              $100 - 500
            </SelectItem>
            <SelectItem value="500+" className="cursor-pointer">
              $500+
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Date selector */}
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="!h-10 w-[200px] cursor-pointer rounded-[8px] border-[#E9E9E9] text-[14px] text-[#020328]/60">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Date
            </SelectItem>
            <SelectItem value="7days" className="cursor-pointer">
              Last 7 Days
            </SelectItem>
            <SelectItem value="30days" className="cursor-pointer">
              Last 30 Days
            </SelectItem>
            <SelectItem value="custom" className="cursor-pointer">
              Custom Range
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

      {/* statistics information */}
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
                    className="h-[52px] px-3 text-[14px] font-medium text-[#020328]"
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
                      className="px-3 py-4 text-[14px] !text-[#020328]/65"
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
        total={1323} // mock total 1323 data
        pageSize={10}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
