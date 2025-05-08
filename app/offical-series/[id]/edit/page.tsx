import Link from "next/link"

import { Button } from "@/components/ui/button"
import { OfficalSeriesForm } from "@/app/offical-series/_components/office-series-form"

export default function EditOfficalSeries({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit OfficalSeries</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/catalogs/${params.id}`}>View OfficalSeries</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/catalogs">Back to OfficalSeriess</Link>
          </Button>
        </div>
      </div>
      <OfficalSeriesForm id={params.id} />
    </div>
  )
}
