import Link from "next/link"

import { Button } from "@/components/ui/button"
import { OfficalSeriesForm } from "@/app/offical-series/_components/office-series-form"

export default function NewOfficalSeries() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New OfficalSeries</h1>
        <Button variant="outline" asChild>
          <Link href="/offical-series">Back to OfficalSeries</Link>
        </Button>
      </div>
      <OfficalSeriesForm />
    </div>
  )
}
