"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

// token distribution data type
interface TokenData {
  name: string // token name
  donors: number // donation count
  amount: number // donation amount ($)
  percentage: number // percentage
  color: string // pie chart color
  [key: string]: string | number // index signature, compatible with recharts type
}

// mock data
const mockData: TokenData[] = [
  {
    name: "ETH",
    donors: 78,
    amount: 6521.88,
    percentage: 9,
    color: "#627EEA"
  },
  {
    name: "SOL",
    donors: 62,
    amount: 5797.54,
    percentage: 8,
    color: "#8752F3"
  },
  {
    name: "USDT",
    donors: 345,
    amount: 28132.41,
    percentage: 39,
    color: "#26A17B"
  },

  {
    name: "DAI",
    donors: 51,
    amount: 5072.21,
    percentage: 7,
    color: "#F4B731"
  },
  {
    name: "BTC",
    donors: 34,
    amount: 2897.62,
    percentage: 4,
    color: "#F7931A"
  },
  {
    name: "USDC",
    donors: 287,
    amount: 23894.67,
    percentage: 33,
    color: "#3C6FBD"
  }
]

// custom label line rendering function
const renderCustomLabelLine = (entry: any) => {
  const { cx, cy, midAngle, outerRadius } = entry
  const RADIAN = Math.PI / 180

  // first line: from the edge of the pie chart
  const startRadius = outerRadius + 2
  const startX = cx + startRadius * Math.cos(-midAngle * RADIAN)
  const startY = cy + startRadius * Math.sin(-midAngle * RADIAN)

  // the turning point of the second line
  const midRadius = outerRadius + 15
  const midX = cx + midRadius * Math.cos(-midAngle * RADIAN)
  const midY = cy + midRadius * Math.sin(-midAngle * RADIAN)

  // third line: horizontal extension
  const endX = midX > cx ? midX + 10 : midX - 10
  const endY = midY

  const pathData = `M${startX},${startY}L${midX},${midY}L${endX},${endY}`

  return <path d={pathData} stroke="#D3D3D3" strokeWidth={1} fill="none" />
}

// custom label rendering function
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percentage
}: any) => {
  const RADIAN = Math.PI / 180
  // calculate the label position (at the end of the label line)
  const radius = outerRadius + 30
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // determine the text alignment based on the angle
  const textAnchor = x > cx ? "start" : "end"

  return (
    <text
      x={x}
      y={y}
      fill="#020328"
      textAnchor={textAnchor}
      dominantBaseline="central"
      className="text-[12px] leading-[16px]"
    >
      <tspan className="text-[#020328] opacity-65">{name}</tspan>
      <tspan className="text-[#020328] opacity-65"> ({percentage}%)</tspan>
    </text>
  )
}

// custom Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as TokenData

    return (
      <div className="rounded-[8px] border border-[#E9E9E9] bg-white p-3 shadow-lg">
        <p className="text-[14px] leading-[18px] font-semibold text-[#020328]">
          {data.name}
        </p>
        <p className="mt-1 text-[12px] leading-[16px] text-[#020328]/65">
          Donors: {data.donors}
        </p>
        <p className="text-[12px] leading-[16px] text-[#020328]/65">
          Donation Amount: ${" "}
          {data.amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>
    )
  }
  return null
}

export default function TokenDistribution() {
  return (
    <div className="h-full w-full rounded-[8px] border border-[#E9E9E9] bg-white p-6">
      <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
        Token Distribution
      </div>
      <div className="mt-6 h-[calc(100%-43px)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              labelLine={renderCustomLabelLine}
              label={renderCustomLabel}
              outerRadius={60}
              innerRadius={30}
              fill="#8884d8"
              dataKey="percentage"
              cursor="pointer"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
