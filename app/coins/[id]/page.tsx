import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CoinDetail } from "@/app/coins/_components/coin-detail"

export default function ViewCoin({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Coin Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/coins/${params.id}/edit`}>Edit Coin</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Coins</Link>
          </Button>
        </div>
      </div>
      <CoinDetail id={params.id} />
    </div>
  )
}
