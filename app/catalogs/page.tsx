import { Suspense } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CatalogList } from "@/app/catalogs/_components/catalog-list"

export default function Home() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Catalogs</h1>
        <Button asChild>
          <Link href="/catalogs/new">Create New Catalog</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CatalogList />
      </Suspense>
    </div>
  )
}
