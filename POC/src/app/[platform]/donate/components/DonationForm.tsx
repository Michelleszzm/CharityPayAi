"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useAccount, Connector, Address, useConnection } from "@ant-design/web3"
import useWalletStore from "@/store/walletStore"

import solanaIcon from "@/assets/wallet/SOL.png"
import bitcoinIcon from "@/assets/wallet/BTC.png"
import ethereumIcon from "@/assets/wallet/ETH.png"
import usdcIcon from "@/assets/wallet/USDC.png"
import usdtIcon from "@/assets/wallet/USDT.png"
import daiIcon from "@/assets/wallet/DAI.png"

import walletIcon from "@/assets/wallet-icon.png"
import copyIcon from "@/assets/copy-icon.png"
import approvalIcon from "@/assets/approved-icon.png"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import DonationTransaction, { TransactionStatus } from "./DonationTransaction"
import { convertUsdToToken, formatTokenAmount } from "@/lib/tokenConversion"

// blockchain configuration
const BLOCKCHAIN_CONFIG = {
  Ethereum: {
    label: "Ethereum",
    icon: ethereumIcon, // temporarily use existing icons, replace with actual Ethereum icons in actual application
    tokens: [
      { name: "USDT", icon: usdtIcon },
      { name: "USDC", icon: usdcIcon },
      { name: "DAI", icon: daiIcon },
      { name: "ETH", icon: ethereumIcon }
    ]
  },
  Solana: {
    label: "Solana",
    icon: solanaIcon, // temporarily use existing icons, replace with actual Solana icons in actual application
    tokens: [
      { name: "USDT", icon: usdtIcon },
      { name: "USDC", icon: usdcIcon },
      { name: "SOL", icon: solanaIcon }
    ]
  },
  Bitcoin: {
    label: "Bitcoin",
    icon: bitcoinIcon, // temporarily use existing icons, replace with actual Bitcoin icons in actual application
    tokens: [{ name: "BTC", icon: bitcoinIcon }]
  }
} as const

// preset amount options
const AMOUNT_OPTIONS = [300, 150, 60, 30, 15]

// foundation receiving address (here should be the actual foundation address)
const FOUNDATION_ADDRESS = "0x35ceCD3d51Fe9E5AD14ea001475668C5A5e5ea76"

// form validation Schema
const donationSchema = z.object({
  blockchain: z.enum(["Ethereum", "Solana", "Bitcoin"]),
  token: z.string().min(1, "Please select a token"),
  amount: z.number().positive("The amount must be greater than 0")
})

type DonationFormValues = z.infer<typeof donationSchema>

// ConnectorButton wrapper component - filter Web3 specific props
interface ConnectorButtonProps extends React.ComponentProps<"button"> {
  onConnectClick?: (wallet?: any) => void
  onDisconnectClick?: () => void
  onSwitchChain?: (chain?: any) => void
  account?: any
  balance?: any
  availableChains?: any[]
  availableWallets?: any[]
  chain?: any
  addressPrefix?: string
  loading?: boolean
  sign?: any
  children: React.ReactNode
  className?: string
}

const ConnectorButton: React.FC<ConnectorButtonProps> = ({
  onConnectClick,
  onDisconnectClick,
  onSwitchChain,
  account,
  balance,
  availableChains,
  availableWallets,
  chain,
  addressPrefix,
  loading,
  sign,
  children,
  className,
  ...buttonProps
}) => {
  return (
    <Button
      className={className}
      onClick={() => onConnectClick?.()}
      {...buttonProps}
    >
      {children}
    </Button>
  )
}

export default function DonationForm({
  changePaySuccess
}: {
  changePaySuccess: () => void
}) {
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      blockchain: "Ethereum",
      token: BLOCKCHAIN_CONFIG.Ethereum.tokens[0].name,
      amount: 30
    }
  })

  // Web3 related hooks
  const { account } = useAccount()
  const { disconnect } = useConnection()
  const { ethereum, setChainWallet } = useWalletStore()

  const watchedBlockchain = form.watch("blockchain")
  const watchedAmount = form.watch("amount")
  const watchedToken = form.watch("token")

  // transaction status management
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.IDLE
  )
  const [transactionHash, setTransactionHash] = useState<string>("")

  // calculate wallet connection status
  const isWalletConnected = !!(account?.address || ethereum?.isConnected)

  // use ref to track the latest wallet connection status, avoid closure trap
  const isWalletConnectedRef = useRef(isWalletConnected)
  const disconnectRef = useRef(disconnect)
  const setChainWalletRef = useRef(setChainWallet)

  // synchronize latest value to ref
  useEffect(() => {
    isWalletConnectedRef.current = isWalletConnected
    disconnectRef.current = disconnect
    setChainWalletRef.current = setChainWallet
  }, [isWalletConnected, disconnect, setChainWallet])

  // listen to account changes, automatically synchronize to walletStore
  useEffect(() => {
    if (account?.address && !ethereum?.isConnected) {
      setChainWallet("ethereum", {
        address: account.address,
        chain: "ethereum",
        chainName: "Ethereum",
        balance: undefined,
        isConnected: true
      })
    }
  }, [account?.address, ethereum?.isConnected, setChainWallet])

  // when the component is unloaded, disconnect
  useEffect(() => {
    return () => {
      // read the latest status from ref, avoid closure trap
      const currentIsConnected = isWalletConnectedRef.current
      const currentDisconnect = disconnectRef.current
      const currentSetChainWallet = setChainWalletRef.current

      if (currentIsConnected && currentDisconnect) {
        currentDisconnect()
          .then(() => {
            console.log("The wallet connection was disconnected successfully")
            // clean up the status in walletStore
            currentSetChainWallet("ethereum", {
              address: "",
              chain: "ethereum",
              chainName: "Ethereum",
              balance: undefined,
              isConnected: false
            })
          })
          .catch(error => {
            console.error("Failed to disconnect the wallet connection:", error)
          })
      }
    }
  }, []) // empty dependency array, but get the latest value through ref

  // when the blockchain changes, reset the token
  const handleBlockchainChange = (
    blockchain: keyof typeof BLOCKCHAIN_CONFIG
  ) => {
    const tokens = BLOCKCHAIN_CONFIG[blockchain].tokens
    form.setValue("token", tokens[0].name)
  }

  // handle amount selection
  const handleAmountSelect = (amount: number) => {
    form.setValue("amount", amount)
  }

  // determine if the button is selected
  const isAmountSelected = (amount: number) => watchedAmount === amount
  const isOtherSelected = () => !AMOUNT_OPTIONS.includes(watchedAmount)

  // handle transaction status change
  const handleTransactionStateChange = (
    status: TransactionStatus,
    txHash?: string,
    error?: string
  ) => {
    setTransactionStatus(status)

    if (txHash) {
      setTransactionHash(txHash)
    }

    // after transaction successful, jump to success page
    if (status === TransactionStatus.SUCCESS) {
      setTimeout(() => {
        changePaySuccess()
      }, 2000) // 2 seconds later jump, let the user see the success prompt
    }

    // handle error
    if (status === TransactionStatus.ERROR && error) {
      console.log("failure of transaction:", error)
      changePaySuccess()
    }
  }

  const onSubmit = (values: DonationFormValues) => {
    // console.log("donation form submitted:", values)
    // form validation passed, actual transaction will be handled by DonationTransaction component
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* blockchain selection */}
          <FormField
            control={form.control}
            name="blockchain"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] leading-[16px] !font-[400] text-[#020328]">
                  Select Blockchain
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: keyof typeof BLOCKCHAIN_CONFIG) => {
                    field.onChange(value)
                    handleBlockchainChange(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="!h-[40px] w-full cursor-pointer rounded-[8px] border border-[#E9E9E9] bg-white">
                      <div className="flex items-center">
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(BLOCKCHAIN_CONFIG).map(([key, config]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={config.icon}
                            alt={config.label}
                            width={24}
                            height={24}
                          />
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* token selection */}
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] leading-[16px] !font-[400] text-[#020328]">
                  Select Token
                </FormLabel>
                <Select
                  key={watchedBlockchain}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="!h-[40px] w-full cursor-pointer rounded-[8px] border border-[#E9E9E9] bg-white">
                      <div className="flex items-center">
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BLOCKCHAIN_CONFIG[watchedBlockchain].tokens.map(token => (
                      <SelectItem
                        key={token.name}
                        value={token.name}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={token.icon}
                            alt={token.name}
                            width={24}
                            height={24}
                          />
                          <span>{token.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* amount selection */}
          <div className="space-y-4">
            <div className="text-[13px] leading-[16px] text-[#020328]">
              Donation Amount (USD)
            </div>

            {/* amount button group */}
            <div className="grid grid-cols-3 gap-3">
              {AMOUNT_OPTIONS.map(amount => (
                <Button
                  key={amount}
                  type="button"
                  variant={isAmountSelected(amount) ? "default" : "outline"}
                  className={`h-[40px] cursor-pointer rounded-[8px] text-[14px] ${
                    isAmountSelected(amount)
                      ? "border-2 border-[#2777FF] bg-white font-bold text-[#2777FF] hover:bg-white"
                      : "border border-[#E9E9E9] bg-white text-[#000000] hover:bg-gray-50"
                  }`}
                  onClick={() => handleAmountSelect(amount)}
                >
                  ${amount}
                </Button>
              ))}

              <Button
                type="button"
                variant={isOtherSelected() ? "default" : "outline"}
                className={`h-[40px] cursor-pointer rounded-[8px] text-[14px] ${
                  isOtherSelected()
                    ? "border-2 border-[#2777FF] bg-white font-bold text-[#2777FF] hover:bg-white"
                    : "border border-[#E9E9E9] bg-white text-[#000000] hover:bg-gray-50"
                }`}
                onClick={() => form.setValue("amount", 0)}
              >
                Other
              </Button>
            </div>

            {/* amount input box (always displayed) */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[16px] text-[#020328]">
                        $
                      </div>
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-[52px] rounded-[8px] border border-[#E9E9E9] bg-white pr-16 pl-8 text-[16px] font-bold text-[#020328]"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                        value={field.value || ""}
                      />
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[14px] text-[#020328]">
                        USD
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* wallet connection button */}
          {!isWalletConnected ? (
            <Connector
              modalProps={{
                mode: "simple"
              }}
            >
              <ConnectorButton className="h-[40px] w-full cursor-pointer rounded-[8px] bg-[#2777FF] text-[16px] font-semibold text-white transition-all duration-200 hover:bg-[#2777FF]/80 hover:shadow-md active:scale-[0.98]">
                <div className="flex items-center justify-center">
                  <Image
                    src={walletIcon}
                    alt="wallet-icon"
                    width={32}
                    height={32}
                    className="mr-2 size-4 transition-transform duration-200"
                  />
                  <div>Connect Wallet</div>
                </div>
              </ConnectorButton>
            </Connector>
          ) : (
            <Button
              disabled
              className="h-[40px] w-full cursor-pointer rounded-[8px] bg-[#2777FF] text-[16px] font-semibold text-white transition-all duration-200 hover:bg-[#2777FF]/80 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center justify-center">
                <Image
                  src={walletIcon}
                  alt="wallet-icon"
                  width={32}
                  height={32}
                  className="mr-2 size-4 transition-transform duration-200"
                />
                <Address
                  ellipsis
                  address={account?.address}
                  className="!text-white"
                />
              </div>
            </Button>
          )}
        </form>
      </Form>
      <div className="mt-4 flex h-[79px] flex-col justify-center rounded-[8px] border border-[#E9E9E9] bg-[#F7F7F7] px-4">
        <div className="flex items-center">
          <div className="text-[14px] leading-[18px] font-[400] text-[#020328]">
            Estimated Tokens：
          </div>
          <div className="text-[14px] leading-[18px] font-bold text-[#020328]">
            {formatTokenAmount(
              convertUsdToToken(watchedAmount, watchedBlockchain, watchedToken),
              watchedToken
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <div className="text-[14px] leading-[18px] font-[400] text-[#020328]">
            Foundation Address：
          </div>
          <div className="text-[14px] leading-[18px] font-bold text-[#020328]">
            {FOUNDATION_ADDRESS.slice(0, 6)}...{FOUNDATION_ADDRESS.slice(-4)}
          </div>
          <Image
            src={copyIcon}
            alt="copy-icon"
            width={48}
            height={48}
            className="ml-2 size-4 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(FOUNDATION_ADDRESS)
              toast.success("Copied to clipboard")
            }}
          />
        </div>
      </div>
      {/* after wallet connection successful, display Approved */}
      {isWalletConnected && (
        <div className="mt-6 flex flex-col items-center">
          <div className="flex items-center">
            <Image
              src={approvalIcon}
              alt="approval-icon"
              width={48}
              height={48}
              className="mr-[10px] size-6"
            />
            <div
              className={`text-[16px] leading-[19px] font-bold ${
                transactionStatus === TransactionStatus.SUCCESS
                  ? "text-[#00A73D]"
                  : transactionStatus === TransactionStatus.PENDING
                    ? "text-[#2777FF]"
                    : transactionStatus === TransactionStatus.ERROR
                      ? "text-[#FF4444]"
                      : "text-[#00A73D]"
              }`}
            >
              {transactionStatus === TransactionStatus.SUCCESS
                ? "Transaction Success!"
                : transactionStatus === TransactionStatus.PENDING
                  ? "Processing..."
                  : transactionStatus === TransactionStatus.ERROR
                    ? "Transaction Failed"
                    : "Approved"}
            </div>
          </div>
          <div className="mt-[6px] text-[12px] leading-[15px] text-[#020328]">
            {transactionStatus === TransactionStatus.SUCCESS &&
            transactionHash ? (
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View transaction on Etherscan
              </a>
            ) : transactionStatus === TransactionStatus.PENDING ? (
              "Please confirm the transaction in your wallet..."
            ) : transactionStatus === TransactionStatus.ERROR ? (
              "Please try again or contact support."
            ) : (
              "Cleared. Safe to donate."
            )}
          </div>
          <div className="mt-6 w-full">
            <DonationTransaction
              blockchain={watchedBlockchain}
              onTransactionStateChange={handleTransactionStateChange}
              renderTrigger={(signTransaction, isLoading, isDisabled) => (
                <Button
                  type="button"
                  disabled={isDisabled || watchedAmount === 0}
                  onClick={() => {
                    const formValues = form.getValues()
                    // convert USD amount to token amount
                    const tokenAmount = convertUsdToToken(
                      formValues.amount,
                      formValues.blockchain,
                      formValues.token
                    )

                    if (tokenAmount === 0) {
                      toast.error(
                        "Conversion failed. Please check the token configuration"
                      )
                      return
                    }

                    signTransaction({
                      blockchain: formValues.blockchain,
                      token: formValues.token,
                      amount: tokenAmount, // use the converted token amount
                      toAddress: FOUNDATION_ADDRESS
                    })
                  }}
                  className="h-[40px] w-full cursor-pointer rounded-[8px] bg-[#00A73D] text-[16px] font-semibold text-white hover:bg-[#00A73D]/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex items-center justify-center">
                    {isLoading ? "Processing..." : "Confirm & Donate"}
                  </div>
                </Button>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
