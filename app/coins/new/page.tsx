import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CoinForm } from "@/app/coins/_components/coin-form"

export default function NewPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Coin</h1>
        <Button variant="outline" asChild>
          <Link href="/">Back to coin</Link>
        </Button>
      </div>
      <CoinForm />
    </div>
  )
}
