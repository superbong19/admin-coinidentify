import { Suspense } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageList } from "@/app/pages/_components/page-list"

export default function Home() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Button asChild>
          <Link href="/pages/new">Create New Page</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <PageList />
      </Suspense>
    </div>
  )
}
