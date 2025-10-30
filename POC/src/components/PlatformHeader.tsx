"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import logoImage from "@/assets/logo.png"
import { useState, useEffect, useMemo } from "react"
import { usePathname, useParams } from "next/navigation"

export default function PlatformHeader() {
  const pathname = usePathname()
  const params = useParams()
  const platform = params.platform as string

  const menuList = useMemo(
    () => [
      {
        name: "Donate",
        href: `/${platform}/donate`
      },
      {
        name: "Donation Overview",
        href: `/${platform}/dashboard`
      },
      {
        name: "Receipts & NFTs",
        href: `/${platform}/receipts`
      }
    ],
    [platform]
  )

  const [activeMenu, setActiveMenu] = useState("")

  useEffect(() => {
    const currentMenu = menuList.find(item => item.href === pathname)
    if (currentMenu) {
      setActiveMenu(currentMenu.name)
    }
  }, [pathname, menuList])

  const handleMenuClick = (name: string) => {
    setActiveMenu(name)
  }
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-18 items-center justify-between pr-16 pl-8">
        <div className="flex items-center">
          <Image
            src={logoImage}
            alt="logo"
            width={564}
            height={80}
            className="h-10 w-auto"
          />
        </div>
        <div className="flex items-center">
          <nav className="hidden md:flex">
            {menuList.map(item => {
              const isActive = activeMenu === item.name
              return (
                <Link
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  href={item.href}
                  className={cn(
                    "relative ml-16 flex cursor-pointer text-sm text-[#000000]/80 hover:text-[#2777FF]",
                    isActive ? "font-bold text-[#2777FF]" : ""
                  )}
                >
                  <div className="flex flex-col items-center">
                    <div>{item.name}</div>
                    {isActive && (
                      <div className="absolute bottom-[-6px] h-[2px] w-10 rounded-[8px] bg-[#2777FF]"></div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
