import Link from "next/link"

import { Button } from "@/components/ui/button"
import { TransactionForm } from "@/app/transactions/_components/transaction-form"

export default function EditTransaction({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Transaction</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/transactions/${params.id}`}>View Transaction</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Transactions</Link>
          </Button>
        </div>
      </div>
      <TransactionForm id={params.id} />
    </div>
  )
}
