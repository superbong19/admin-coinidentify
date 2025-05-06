import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageDetail } from "@/app/pages/_components/page-detail"

export default function ViewPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Page Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/pages/${params.id}/edit`}>Edit Page</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Pages</Link>
          </Button>
        </div>
      </div>
      <PageDetail id={params.id} />
    </div>
  )
}
