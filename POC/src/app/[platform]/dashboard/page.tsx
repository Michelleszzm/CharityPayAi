"use client"

import { useState, useEffect, useCallback } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { motion, AnimatePresence } from "motion/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import Image from "next/image"
import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import ethereumIcon from "@/assets/wallet/ETH.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import daiIcon from "@/assets/wallet/DAI.png"
import arrowRightIcon from "@/assets/arrows-icon.png"
import classifyImage from "@/assets/classify-icon.png"
import aiImage from "@/assets/ai.png"

interface DonationItem {
  id: string
  amount: number
  token: string
  time: string
  charity: string
  chain: string
  txHash: string
  risk: "Low" | "Medium" | "High"
  riskLabel: string
  icon: any
  isNew?: boolean
}

interface AllocationItem {
  name: string
  value: number
  color: string
  [key: string]: any
}

export default function DashboardPage() {
  const [selectedChain, setSelectedChain] = useState("all")
  const [selectedToken, setSelectedToken] = useState("all")
  const [selectedAmount, setSelectedAmount] = useState("all")
  const [displayedDonations, setDisplayedDonations] = useState<DonationItem[]>(
    []
  )
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // mock donation data
  const donationData: DonationItem[] = [
    {
      id: "1",
      amount: 30,
      token: "ETH",
      time: "2025-09-28 10:15:55",
      charity: "Super Joey Foundation",
      chain: "Ethereum",
      txHash: "0x9fC1...8dE2",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: ethereumIcon
    },
    {
      id: "2",
      amount: 100,
      token: "BTC",
      time: "2025-09-28 10:15:32",
      charity: "Super Joey Foundation",
      chain: "Bitcoin",
      txHash: "0x12ab...9fE3",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: bitcoinIcon
    },
    {
      id: "3",
      amount: 60,
      token: "USDT",
      time: "2025-09-28 10:15:08",
      charity: "Super Joey Foundation",
      chain: "Solana",
      txHash: "0x34df...7AI2",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: usdtIcon
    },
    {
      id: "4",
      amount: 88,
      token: "SOL",
      time: "2025-09-28 10:14:56",
      charity: "Super Joey Foundation",
      chain: "Solana",
      txHash: "0x9fC1...8dE2",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: solanaIcon
    },
    {
      id: "5",
      amount: 124,
      token: "USDT",
      time: "2025-09-28 10:14:47",
      charity: "Super Joey Foundation",
      chain: "Solana",
      txHash: "0x56aB...3cD4",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: usdtIcon
    },
    {
      id: "6",
      amount: 5,
      token: "USDT",
      time: "2025-09-28 10:14:47",
      charity: "Super Joey Foundation",
      chain: "Solana",
      txHash: "0x56aB...3cD4",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: usdtIcon
    },
    {
      id: "7",
      amount: 53,
      token: "DAI",
      time: "2025-09-28 10:14:47",
      charity: "Super Joey Foundation",
      chain: "Ethereum",
      txHash: "0x56aB...3cD4",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: daiIcon
    }
  ]

  // three new data examples
  const newDonationDataList: DonationItem[] = [
    {
      id: "new-1",
      amount: 150,
      token: "ETH",
      time: new Date()
        .toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
        .replace(/\//g, "-"),
      charity: "Super Joey Foundation",
      chain: "Ethereum",
      txHash: "0xabc1...2def",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: ethereumIcon,
      isNew: true
    },
    {
      id: "new-2",
      amount: 75,
      token: "USDC",
      time: new Date(Date.now() + 1500)
        .toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
        .replace(/\//g, "-"),
      charity: "Super Joey Foundation",
      chain: "Ethereum",
      txHash: "0x1234...5678",
      risk: "Low",
      riskLabel: "Low - Safe Donation",
      icon: usdcIcon,
      isNew: true
    },
    {
      id: "new-3",
      amount: 200,
      token: "SOL",
      time: new Date(Date.now() + 3000)
        .toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
        .replace(/\//g, "-"),
      charity: "Super Joey Foundation",
      chain: "Solana",
      txHash: "0x9876...abcd",
      risk: "Medium",
      riskLabel: "Medium - Reviewed",
      icon: solanaIcon,
      isNew: true
    }
  ]

  // page initialization and new data insertion logic
  useEffect(() => {
    // when the page is initialized, directly set the data
    setDisplayedDonations(donationData)
    setIsInitialLoad(false)

    // create three timers, insert one new data every 1.5 seconds
    const timers: NodeJS.Timeout[] = []

    newDonationDataList.forEach((newData, index) => {
      const timer = setTimeout(
        () => {
          setDisplayedDonations(prev => [newData, ...prev])
        },
        (index + 1) * 1500
      ) // 1.5 seconds, 3 seconds, 4.5 seconds

      timers.push(timer)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [])

  // fund allocation data
  const allocationData: AllocationItem[] = [
    { name: "Medical Aid", value: 42, color: "#033674" },
    { name: "Family Support", value: 28, color: "#035AB6" },
    { name: "Psychological Care", value: 16, color: "#247DDD" },
    { name: "Research & Awareness", value: 14, color: "#0F93FF" }
  ]

  // custom label line rendering function
  const renderCustomizedLabelLine = useCallback((entry: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius } = entry
    const RADIAN = Math.PI / 180

    // first line: from the edge of the pie chart
    const startRadius = outerRadius + 5
    const startX = cx + startRadius * Math.cos(-midAngle * RADIAN)
    const startY = cy + startRadius * Math.sin(-midAngle * RADIAN)

    // the turning point of the second line
    const midRadius = outerRadius + 15
    const midX = cx + midRadius * Math.cos(-midAngle * RADIAN)
    const midY = cy + midRadius * Math.sin(-midAngle * RADIAN)

    // third line: horizontal extension
    const endX = midX > cx ? midX + 15 : midX - 15
    const endY = midY

    const pathData = `M${startX},${startY}L${midX},${midY}L${endX},${endY}`

    return <path d={pathData} stroke="#D3D3D3" strokeWidth={1} fill="none" />
  }, [])

  // custom label rendering function
  const renderCustomizedLabel = useCallback((entry: any) => {
    const { cx, cy, midAngle, outerRadius, percent } = entry
    const RADIAN = Math.PI / 180

    // calculate the label position, align with the end of the line
    const midRadius = outerRadius + 15
    const midX = cx + midRadius * Math.cos(-midAngle * RADIAN)
    const midY = cy + midRadius * Math.sin(-midAngle * RADIAN)

    // the label position after horizontal extension
    const x = midX > cx ? midX + 20 : midX - 20
    const y = midY

    // dynamically set the font size according to the percentage size
    let fontSize = 16

    return (
      <text
        x={x}
        y={y}
        fill="#020328"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={"medium"}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }, [])

  // get the risk label color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-[#00B140] text-[#020328]/50"
      case "Medium":
        return "bg-[#FFA900] text-[#020328]/50"
      case "High":
        return "bg-[#FE6767] text-[#020328]/50"
      default:
        return "bg-[#00B140] text-[#020328]/50"
    }
  }

  // filter donation data
  const filteredDonationData = displayedDonations.filter(donation => {
    // chain filter
    if (
      selectedChain !== "all" &&
      donation.chain.toLowerCase() !== selectedChain
    ) {
      return false
    }

    // token filter
    if (
      selectedToken !== "all" &&
      donation.token.toLowerCase() !== selectedToken
    ) {
      return false
    }

    // amount filter
    if (selectedAmount !== "all") {
      const amount = donation.amount
      if (selectedAmount === "0-50" && (amount < 0 || amount > 50)) {
        return false
      }
      if (selectedAmount === "50-100" && (amount < 50 || amount > 100)) {
        return false
      }
      if (selectedAmount === "100+" && amount <= 100) {
        return false
      }
    }

    return true
  })

  return (
    <div className="mt-[24px] flex items-center justify-center">
      <div className="flex h-[720px] w-[1280px] rounded-2xl border border-[#E9E9E9] bg-white px-6 py-8 shadow-[0px_0px_16px_0px_rgba(84,93,105,0.1)]">
        {/* left Donation Stream */}
        <div className="flex-1 pr-20">
          <div className="mb-4">
            <div className="mb-4 flex items-center">
              <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
                Donation Stream
              </div>

              {/* AI AML Risk legend */}
              <div className="ml-[100px] flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={aiImage}
                    alt="ai"
                    width={36}
                    height={36}
                    className="size-[18px]"
                  />
                  <span className="text-[11px] leading-[14px] text-[#020328]">
                    AI AML Risk:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="mr-[3px] size-2 rounded-full bg-[#00B140]"></div>
                    <span className="text-[11px] leading-[14px] text-[#020328]/65">
                      Low - Safe Donation
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-[3px] size-2 rounded-full bg-[#FFA900]"></div>
                    <span className="text-[11px] leading-[14px] text-[#020328]/65">
                      Medium - Reviewed
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-[3px] size-2 rounded-full bg-[#FE6767]"></div>
                    <span className="text-[11px] leading-[14px] text-[#020328]/65">
                      High - Blocked
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* filter */}
            <div className="flex items-center gap-4">
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger className="flex-1 cursor-pointer">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    All Chains
                  </SelectItem>
                  <SelectItem value="ethereum" className="cursor-pointer">
                    Ethereum
                  </SelectItem>
                  <SelectItem value="solana" className="cursor-pointer">
                    Solana
                  </SelectItem>
                  <SelectItem value="bitcoin" className="cursor-pointer">
                    Bitcoin
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger className="flex-1 cursor-pointer">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    All Tokens
                  </SelectItem>
                  <SelectItem value="btc" className="cursor-pointer">
                    BTC
                  </SelectItem>
                  <SelectItem value="eth" className="cursor-pointer">
                    ETH
                  </SelectItem>
                  <SelectItem value="usdc" className="cursor-pointer">
                    USDC
                  </SelectItem>
                  <SelectItem value="usdt" className="cursor-pointer">
                    USDT
                  </SelectItem>
                  <SelectItem value="sol" className="cursor-pointer">
                    SOL
                  </SelectItem>
                  <SelectItem value="dai" className="cursor-pointer">
                    DAI
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                <SelectTrigger className="flex-1 cursor-pointer">
                  <SelectValue placeholder="Amount Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    Amount Range
                  </SelectItem>
                  <SelectItem value="0-50" className="cursor-pointer">
                    $0 - 50
                  </SelectItem>
                  <SelectItem value="50-100" className="cursor-pointer">
                    $50 - 100
                  </SelectItem>
                  <SelectItem value="100+" className="cursor-pointer">
                    $100+
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* donation list */}
          <div className="scrollbar-hide max-h-[570px] space-y-4 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredDonationData.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  layout
                  initial={{
                    opacity: 0,
                    x: donation.isNew ? 200 : 100,
                    scale: donation.isNew ? 1.05 : 1
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    x: -100,
                    scale: 0.95
                  }}
                  transition={{
                    duration: donation.isNew ? 0.8 : 0.5,
                    delay: donation.isNew ? 0 : index * 0.1,
                    type: donation.isNew ? "spring" : "tween",
                    stiffness: donation.isNew ? 100 : undefined,
                    damping: donation.isNew ? 15 : undefined
                  }}
                  className="cursor-pointer rounded-[8px] border border-[#E9E9E9] p-4 transition-colors hover:border-gray-300"
                >
                  {/* token icon and amount */}
                  <div className="flex items-center">
                    <Image
                      src={donation.icon}
                      alt="icon"
                      width={24}
                      height={24}
                    />
                    <div className="ml-2 text-[16px] leading-[19px] font-bold text-[#020328]">
                      ${donation.amount}
                    </div>
                    <div className="ml-4 text-[12px] leading-[15px] text-[#020328]/50">
                      {donation.time}
                    </div>
                  </div>

                  <div className="mt-[15px] flex items-center">
                    <div className="w-[40%] flex-none text-[12px] leading-[15px] text-[#020328]/50">
                      <div>Charity：{donation.charity}</div>
                      <div>Chain：{donation.chain}</div>
                    </div>
                    <div className="flex-1 text-[12px] leading-[15px] text-[#020328]/50">
                      <div
                        className="flex items-center"
                        onClick={() => {
                          window.open(
                            "https://etherscan.io/tx/0x475005cfa5fcbc0f35e429a23f8014a4554908afed18b67ebcfd936e2b24068c",
                            "_blank"
                          )
                        }}
                      >
                        Tx Hash：
                        <div className="text-[#1890FF]">{donation.txHash}</div>
                        <Image
                          src={arrowRightIcon}
                          alt="arrow-right"
                          width={12}
                          height={20}
                          className="ml-[6px] h-auto w-1"
                        />
                      </div>
                      <div className="flex items-center">
                        Risk：
                        <div
                          className={`mr-1 size-2 rounded-full ${getRiskColor(donation.risk)}`}
                        ></div>
                        <div>{donation.riskLabel}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* right Fund Allocation */}
        <div className="w-[452px]">
          <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
            Fund Allocation
          </div>

          <div className="mt-6 flex h-[620px] flex-col rounded-[16px] bg-[#F7F7F7] px-10">
            {/* pie chart */}
            <div className="relative">
              <ResponsiveContainer width="100%" height={305}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={renderCustomizedLabelLine}
                    isAnimationActive={false}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{ outline: "none" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={() => null} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* classification list */}
            <div className="mt-[42px]">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-[14px] leading-[32px] text-[#020328]">
                    {item.name}
                  </div>
                  <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-[-24px] mt-[30px]">
              <Image
                src={classifyImage}
                alt="classify"
                width={840}
                height={200}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
