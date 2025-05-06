import { Suspense } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { OfficalSeriesList } from "@/app/offical-series/_components/office-series-list"

export default function Home() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">OfficalSeriess</h1>
        <Button asChild>
          <Link href="/offical-seriess/new">Create New OfficalSeries</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <OfficalSeriesList />
      </Suspense>
    </div>
  )
}
