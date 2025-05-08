import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CatalogForm } from "@/app/catalogs/_components/catalog-form"

export default function NewCatalog() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Catalog</h1>
        <Button variant="outline" asChild>
          <Link href="/catalogs">Back to Catalogs</Link>
        </Button>
      </div>
      <CatalogForm />
    </div>
  )
}
