import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageForm } from "@/app/pages/_components/page-form"

export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Page</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/pages/${params.id}`}>View Page</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Pages</Link>
          </Button>
        </div>
      </div>
      <PageForm id={params.id} />
    </div>
  )
}
