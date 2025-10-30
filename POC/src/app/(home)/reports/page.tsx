"use client"

import Image from "next/image"
import bgImage from "@/assets/home/bg3.png"
import DonationTrend from "./components/DonationTrend"
import ChainDistribution from "./components/ChainDistribution"
import TokenDistribution from "./components/TokenDistribution"
import DonationAmountDistribution from "./components/DonationAmountDistribution"
import DonationFrequencyDistribution from "./components/DonationFrequencyDistribution"
import AccountSecurityDistribution from "./components/AccountSecurityDistribution"

export default function ReportsPage() {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 h-[250px] w-full bg-[#FFF1C5]">
        <Image
          src={bgImage}
          alt="bg"
          width={3072}
          height={500}
          className="h-full w-auto"
        />
      </div>
      <div className="relative z-2">
        <div className="flex justify-center pt-12">
          <div className="w-[1280px]">
            <div className="text-[32px] leading-[39px] font-bold text-[#000]">
              Reports
            </div>
            <div className="mt-2 text-[16px] leading-[19px] text-[#000]">
              Visualize donation trends, token distribution, and donor behavior.
            </div>
          </div>
        </div>
        {/* cards */}
        <div className="flex justify-center">
          <div
            className="mt-12 w-[1280px] rounded-2xl bg-white px-6 py-12"
            style={{
              border: "1px solid #E9E9E9",
              boxShadow: "0px 0px 16px 0px rgba(84,93,105,0.1)"
            }}
          >
            <div className="grid grid-cols-4 gap-6">
              <div className="flex h-[68px] flex-col items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
                <div className="text-[14px] leading-[18px] text-[#020328]">
                  Total Donors
                </div>
                <div className="mt-1 text-[18px] leading-[22px] font-bold text-[#58A0E2]">
                  887
                </div>
              </div>
              <div className="flex h-[68px] flex-col items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
                <div className="text-[14px] leading-[18px] text-[#020328]">
                  Total Donations
                </div>
                <div className="mt-1 text-[18px] leading-[22px] font-bold text-[#FE9727]">
                  $ 157,456
                </div>
              </div>
              <div className="flex h-[68px] flex-col items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
                <div className="text-[14px] leading-[18px] text-[#020328]">
                  Total Donation Count
                </div>
                <div className="mt-1 text-[18px] leading-[22px] font-bold text-[#32BBB0]">
                  1,323
                </div>
              </div>
              <div className="flex h-[68px] flex-col items-center justify-center rounded-[8px] border border-[#E9E9E9] bg-white">
                <div className="text-[14px] leading-[18px] text-[#020328]">
                  Donation per Capita
                </div>
                <div className="mt-1 text-[18px] leading-[22px] font-bold text-[#9910FA]">
                  $ 177.52
                </div>
              </div>
            </div>
            <div className="mt-8 h-[302px]">
              <DonationTrend />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-8">
              <div className="h-[305px]">
                <ChainDistribution />
              </div>
              <div className="h-[305px]">
                <TokenDistribution />
              </div>
              <div className="h-[305px]">
                <DonationAmountDistribution />
              </div>
              <div className="h-[305px]">
                <DonationFrequencyDistribution />
              </div>
              <div className="h-[305px]">
                <AccountSecurityDistribution />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
