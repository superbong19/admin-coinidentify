import { Suspense } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { TransactionList } from "@/app/transactions/_components/transaction-list"

export default function Home() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button asChild>
          <Link href="/transactions/new">Create New Transaction</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <TransactionList />
      </Suspense>
    </div>
  )
}
