"use client"
import DonationForm from "./components/DonationForm"
import { EthereumProvider } from "@/components/Web3Provider"
import { useState } from "react"
import { motion } from "motion/react"
import DonationFormSuccess from "./components/DonationFormSuccess"
import StarSvg from "./components/StarSvg"
export default function DashboardPage() {
  const [paySuccess, setPaySuccess] = useState(false)
  const changePaySuccess = () => {
    setPaySuccess(true)
  }
  return (
    <EthereumProvider>
      <div className="mt-[54px]">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className="w-[381px] text-center text-[32px] leading-[39ppx] font-bold text-[#000000]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Donate in Crypto, Empower Every Cause
            </motion.div>
            <motion.div
              className="mt-4 w-[580px] text-center text-[12px] leading-[20ppx] text-[#000000]/80"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            >
              With just a tap, your kindness reaches instantly. Let every crypto
              coin become a force for change. Each click from you is a seed of
              love, together lighting hope in the lives of those in need.
            </motion.div>
            <div className="mt-10 h-[500px] w-[600px]">
              <StarSvg />
            </div>
          </div>
          <div className="ml-[130px] w-[500px] rounded-2xl border border-[#E9E9E9] bg-white px-6 py-8 shadow-[0px_0px_16px_0px_rgba(84,93,105,0.1)]">
            {paySuccess && <DonationFormSuccess />}
            {!paySuccess && (
              <div>
                <div className="flex items-center">
                  <div className="text-[14px] leading-[18px] font-[500] text-[#000000]/60">
                    Donate to
                  </div>
                  <div className="ml-1 text-[16px] leading-[19px] font-bold text-[#000000]">
                    Super Joey Foundation
                  </div>
                </div>
                <div className="mt-6">
                  <DonationForm changePaySuccess={changePaySuccess} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </EthereumProvider>
  )
}
