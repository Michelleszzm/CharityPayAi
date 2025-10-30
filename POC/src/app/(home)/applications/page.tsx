"use client"

import Image from "next/image"
import bgImage from "@/assets/home/bg3.png"
import { cn } from "@/lib/utils"
import { useState } from "react"
import PendingReview from "./components/PendingReview"
import ApprovedList from "./components/ApprovedList"

export default function Applications() {
  const tabList = [
    {
      name: "Pending Review (12)",
      value: 1
    },
    {
      name: "Approved (17)",
      value: 2
    }
  ]
  const [activeTab, setActiveTab] = useState(tabList[0].value)

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
              Applications
            </div>
            <div className="mt-2 text-[16px] leading-[19px] text-[#000]">
              View and review nonprofit applications.
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
            {/* tab switch */}
            <div className="flex gap-12">
              {tabList.map(item => {
                const isActive = activeTab === item.value
                return (
                  <div
                    key={item.value}
                    className={cn(
                      "relative cursor-pointer text-[18px] leading-[22px] text-[#020328]",
                      isActive ? "font-bold text-[#FE5827]" : ""
                    )}
                    onClick={() => setActiveTab(item.value)}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-[-8px] left-0 h-[2px] w-full bg-[#FE5827]"></div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-[42px]">
              {activeTab === 2 ? (
                <ApprovedList />
              ) : (
                <PendingReview key={activeTab} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
