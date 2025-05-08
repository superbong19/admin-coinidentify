"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CoinList } from "@/app/coins/_components/coin-list"

export default function Home({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || ""
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {name ? `Coins in ${name}` : "Coins"}
        </h1>
        <Button asChild>
          <Link href="/offical-series">Back to offical-series</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CoinList officalSeriesId={params.id} />
      </Suspense>
    </div>
  )
}
