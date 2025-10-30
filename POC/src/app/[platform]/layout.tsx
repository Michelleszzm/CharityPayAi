import PlatformHeader from "@/components/PlatformHeader"

export default function PlatformLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-gray-900">
      <PlatformHeader />

      {/* Platform Content */}
      <main>{children}</main>
    </div>
  )
}
