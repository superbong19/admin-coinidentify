import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CatalogForm } from "@/app/catalogs/_components/catalog-form"

export default function EditCatalog({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Catalog</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/catalogs/${params.id}`}>View Catalog</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Catalogs</Link>
          </Button>
        </div>
      </div>
      <CatalogForm id={params.id} />
    </div>
  )
}
