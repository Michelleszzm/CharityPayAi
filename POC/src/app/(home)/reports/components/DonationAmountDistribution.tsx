"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

// donation amount distribution data type
interface AmountDistributionData {
  range: string // amount range
  donors: number // donation count
  amount: number // donation amount ($)
  percentage: number // percentage
  color: string // pie chart color
  [key: string]: string | number // index signature, compatible with recharts type
}

// mock data (according to the design)
const mockData: AmountDistributionData[] = [
  {
    range: "$20~50",
    donors: 107,
    amount: 3051.24,
    percentage: 31,
    color: "#F8A234"
  },
  {
    range: "$50~100",
    donors: 93,
    amount: 2656.14,
    percentage: 27,
    color: "#F1AC4C"
  },
  {
    range: "$100~200",
    donors: 41,
    amount: 1180.51,
    percentage: 12,
    color: "#FDC46D"
  },
  {
    range: "$200~500",
    donors: 134,
    amount: 3836.43,
    percentage: 39,
    color: "#FED385"
  },
  {
    range: "Above $500",
    donors: 10,
    amount: 293.53,
    percentage: 3,
    color: "#FFE09A"
  },
  {
    range: "$0~20",
    donors: 62,
    amount: 1770.06,
    percentage: 18,
    color: "#F7931A"
  }
]

// calculate total
const totalDonors = mockData.reduce((sum, item) => sum + item.donors, 0)
const totalAmount = mockData.reduce((sum, item) => sum + item.amount, 0)

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
  range,
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
      <tspan className="text-[#020328] opacity-65">{range}</tspan>
      <tspan className="text-[#020328] opacity-65"> ({percentage}%)</tspan>
    </text>
  )
}

// center label component
const CenterLabel = ({
  viewBox,
  totalDonors,
  totalAmount
}: {
  viewBox?: any
  totalDonors: number
  totalAmount: number
}) => {
  const { cx, cy } = viewBox || { cx: 0, cy: 0 }

  return (
    <text x={cx} y={cy} textAnchor="middle">
      <tspan
        x={cx}
        dy="-0.6em"
        className="text-[12px] leading-[16px]"
        fill="#020328"
        opacity="0.65"
      >
        Donors: {totalDonors}
      </tspan>
      <tspan
        x={cx}
        dy="1.5em"
        className="text-[12px] leading-[16px]"
        fill="#020328"
        opacity="0.65"
      >
        Donation Amount: ${" "}
        {totalAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </tspan>
    </text>
  )
}

// custom Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as AmountDistributionData

    return (
      <div className="rounded-[8px] border border-[#E9E9E9] bg-white p-3 shadow-lg">
        <p className="text-[14px] leading-[18px] font-semibold text-[#020328]">
          {data.range}
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

export default function DonationAmountDistribution() {
  return (
    <div className="h-full w-full rounded-[8px] border border-[#E9E9E9] bg-white p-6">
      <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
        Donation Amount Distribution
      </div>
      <div className="mt-6 h-[calc(100%-43px)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 80 }}>
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
            {/* center label */}
            <text className="recharts-text recharts-label">
              <CenterLabel
                totalDonors={totalDonors}
                totalAmount={totalAmount}
              />
            </text>
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
