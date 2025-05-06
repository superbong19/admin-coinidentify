import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageForm } from "@/app/pages/_components/page-form"

export default function NewPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Page</h1>
        <Button variant="outline" asChild>
          <Link href="/">Back to Pages</Link>
        </Button>
      </div>
      <PageForm />
    </div>
  )
}
