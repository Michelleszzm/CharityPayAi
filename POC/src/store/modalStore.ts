import { create } from "zustand"

interface ModalStore {
  loginModalOpen: boolean
  setLoginModalOpen: (open: boolean) => void
  registerModalOpen: boolean
  setRegisterModalOpen: (open: boolean) => void
  profileModalOpen: boolean
  setProfileModalOpen: (open: boolean) => void
  submitSuccessfullyModalOpen: boolean
  setSubmitSuccessfullyModalOpen: (open: boolean) => void
}

const useModalStore = create<ModalStore>(set => ({
  loginModalOpen: false,
  setLoginModalOpen: (open: boolean) => set({ loginModalOpen: open }),
  registerModalOpen: false,
  setRegisterModalOpen: (open: boolean) => set({ registerModalOpen: open }),
  profileModalOpen: false,
  setProfileModalOpen: (open: boolean) => set({ profileModalOpen: open }),
  submitSuccessfullyModalOpen: false,
  setSubmitSuccessfullyModalOpen: (open: boolean) =>
    set({ submitSuccessfullyModalOpen: open })
}))

export default useModalStore
