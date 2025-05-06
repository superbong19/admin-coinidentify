import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CoinForm } from "@/app/coins/_components/coin-form"

export default function EditCoin({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Coin</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/coins/${params.id}`}>View Coin</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Coins</Link>
          </Button>
        </div>
      </div>
      <CoinForm id={params.id} />
    </div>
  )
}
