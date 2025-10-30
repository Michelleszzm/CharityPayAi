import Image from "next/image"
import pdfIcon from "@/assets/pdf.png"
import commemorativeIcon from "@/assets/commemorative-icon.png"
import divisionIcon from "@/assets/division-icon.png"
export default function DonationFormSuccess({
  showTitle = true,
  price = 30,
  time = "2025-09-28 10:15:55",
  ownId = "NFT#SJF0003072",
  owner = "0x56aB…3cD4"
}: {
  showTitle?: boolean
  price?: number
  time?: string
  ownId?: string
  owner?: string
}) {
  return (
    <div>
      {showTitle && (
        <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
          Donation receipt & NFT Badge
        </div>
      )}
      <div className="mt-6 rounded-2xl bg-[#F7F7F7] px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-[14px] leading-[18px] text-[#020328]">
            {time}
          </div>
          <div className="flex items-center">
            <div className="text-[14px] leading-[18px] text-[#020328]">$</div>
            <div className="mx-[2px] mb-1 text-[24px] leading-[29px] font-bold text-[#020328]">
              {price}
            </div>
            <div className="text-[14px] leading-[18px] text-[#020328]">USD</div>
          </div>
        </div>
        <div className="mt-4 rounded-[8px] bg-[#EDEDED] px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
              Transaction Hash
            </div>
            <div className="text-[14px] leading-[32px] text-[#020328]/65">
              0x9fC1…8dE2
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
              Blockchain
            </div>
            <div className="text-[14px] leading-[32px] text-[#020328]/65">
              Ethereum
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
              Donor Address
            </div>
            <div className="text-[14px] leading-[32px] text-[#020328]/65">
              0x9fC1…8dE2
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
              Foundation Address
            </div>
            <div className="text-[14px] leading-[32px] text-[#020328]/65">
              0x1234...abcd
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex h-[32px] w-[157px] cursor-pointer items-center justify-center rounded-[6px] border border-[#2777FF]">
            <Image src={pdfIcon} alt="pdf-icon" width={16} height={16} />
            <div className="ml-2 text-[12px] font-bold text-[#2777FF]">
              Download Receipt
            </div>
          </div>
          <div
            className="cursor-pointer text-[12px] text-[#2777FF]"
            onClick={() => {
              window.open(
                "https://etherscan.io/tx/0x475005cfa5fcbc0f35e429a23f8014a4554908afed18b67ebcfd936e2b24068c",
                "_blank"
              )
            }}
          >
            View on Ethereum Explorer
          </div>
        </div>
        <div className="mx-[-16px] my-3">
          <Image
            src={divisionIcon}
            alt="division-icon"
            width={904}
            height={48}
            className="h-auto w-full"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
            Commemorative NFT
          </div>
          <div className="cursor-pointer text-[14px] leading-[18px] font-bold text-[#2777FF]">
            Save
          </div>
        </div>
        <div className="mt-3 flex flex-col items-center justify-center">
          <Image
            src={commemorativeIcon}
            alt="commemorative-icon"
            width={320}
            height={320}
            className="h-auto w-[160px]"
          />
          <div className="mt-4 w-[162px] text-[14px] leading-[18px] font-bold text-[#020328]">
            ID: {ownId} Owner: {owner}
          </div>
          <div className="mt-2 text-[11px] leading-[14px] text-[#020328]/65">
            Receipt & NFT are permanently recorded on the blockchain.
          </div>
        </div>
      </div>
    </div>
  )
}
