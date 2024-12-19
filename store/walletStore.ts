import { create } from 'zustand'

interface WalletInfo {
  email: string
  address: string
  type: string
  linkedUser: string
}

interface WalletState {
  walletInfo: WalletInfo | null
  setWalletInfo: (info: WalletInfo) => void
  clearWalletInfo: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  walletInfo: null,
  setWalletInfo: (info) => set({ walletInfo: info }),
  clearWalletInfo: () => set({ walletInfo: null }),
}))

