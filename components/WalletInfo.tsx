'use client'

import { useWalletStore } from '@/store/walletStore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WalletInfo() {
  const walletInfo = useWalletStore((state) => state.walletInfo)

  if (!walletInfo) {
    return null
  }

  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full mb-4">
      <CardHeader>
        <CardTitle>Wallet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Email:</strong> {walletInfo.email}</p>
        <p><strong>Address:</strong> {walletInfo.address}</p>
        <p><strong>Type:</strong> {walletInfo.type}</p>
        <p><strong>Linked User:</strong> {walletInfo.linkedUser}</p>
      </CardContent>
    </Card>
  )
}

