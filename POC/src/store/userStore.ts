import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface UserStore {
  isLogin: boolean
  setIsLogin: (isLogin: boolean) => void
  getIsLogin: () => boolean
  account: string
  setAccount: (account: string) => void
}

// SSR safe storage engine
const storage = createJSONStorage(() => {
  if (typeof window !== "undefined") {
    return localStorage
  }
  // Return empty implementation to avoid errors on the server
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  }
})

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isLogin: false,
      setIsLogin: (isLogin: boolean) => set({ isLogin }),
      getIsLogin: () => get().isLogin,
      account: "",
      setAccount: (account: string) => set({ account })
    }),
    {
      name: "user-storage",
      storage,
      // Only persist isLogin and account fields (excluding function methods)
      partialize: state => ({ isLogin: state.isLogin, account: state.account })
    }
  )
)

export default useUserStore
