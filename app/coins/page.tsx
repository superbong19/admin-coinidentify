import { Suspense } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CoinList } from "@/app/coins/_components/coin-list"

export default function Home() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Coins</h1>
        <Button asChild>
          <Link href="/coins/new">Create New Coin</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CoinList />
      </Suspense>
    </div>
  )
}
