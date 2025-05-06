"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  MoreVertical,
  Pencil,
  Search,
  Trash,
} from "lucide-react"

import type { Transaction } from "@/types/transaction"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TransactionList() {
  const router = useRouter()

  const limit = 5 // Fixed transaction size

  // Local state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [currentCursor, setCurrentCursor] = useState<string | null>("")
  const [totalItems, setTotalItems] = useState(0)
  const [cursorStack, setCursorStack] = useState<string[]>([])
  const [currentPosition, setCurrentPosition] = useState(0)

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Update URL with current filters and cursor
  const updateUrl = (search: string, status: string, cursor: string | null) => {
    // const params = new URLSearchParams()
    // if (search) params.set("search", search)
    // if (status !== "all") params.set("status", status)
    // if (cursor) params.set("cursor", cursor)

    // const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
    // router.push(newUrl, { scroll: false })
    fetchTransactions(search, status, currentCursor)
  }

  // Fetch transactions with filters and cursor pagination
  const fetchTransactions = async (
    search: string,
    status: string,
    cursor: string | null,
    isReset = false
  ) => {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (status !== "all") params.append("status", status)
      if (cursor) params.append("cursor", cursor)
      params.append("limit", limit.toString())

      const config: any = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:7799/api/transactions",
        headers: {
          accept: "application/json",
        },
        params: {
          limit: 100,
          cursor,
        },
      }
      const response = await axios.request(config)

      const data = response.data
      setTransactions(data.data)
      // setPrevCursor(nextCursor)
      setNextCursor(data.cursor)
      setTotalItems(data.elements)

      // Update cursor stack for navigation
      if (isReset) {
        // Reset cursor stack when filters change
        if (data.meta.nextCursor) {
          setCursorStack([data.meta.nextCursor])
          setCurrentPosition(0)
        } else {
          setCursorStack([])
          setCurrentPosition(0)
        }
      } else if (cursor && !cursorStack.includes(cursor)) {
        // Add new cursor to stack if moving forward
        const newStack = [...cursorStack]
        if (currentPosition < newStack.length - 1) {
          // If we're not at the end, truncate the stack
          newStack.splice(currentPosition + 1)
        }
        newStack.push(cursor)
        setCursorStack(newStack)
        setCurrentPosition(newStack.length - 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load transactions. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentCursor(null) // Reset cursor on new search
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentCursor(null) // Reset cursor on new filter
  }

  // Handle next transaction
  const handleNextTransaction = () => {
    if (nextCursor) {
      setPrevCursor(currentCursor)
      setCurrentCursor(nextCursor)
      fetchTransactions(debouncedSearch, statusFilter, nextCursor)
    }
  }

  // Handle previous transaction
  const handlePrevTransaction = () => {
    if (prevCursor) {
      setCurrentCursor(prevCursor)
      fetchTransactions(debouncedSearch, statusFilter, prevCursor)
    } else {
      // Go to first transaction
      setCurrentCursor(null)
      updateUrl(debouncedSearch, statusFilter, null)
    }
  }

  // Effect to fetch data when filters or cursor change
  useEffect(() => {
    const isReset = currentCursor === null
    fetchTransactions(debouncedSearch, statusFilter, currentCursor, isReset)
    updateUrl(debouncedSearch, statusFilter, currentCursor)
  }, [debouncedSearch, statusFilter, currentCursor])

  if (loading && transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                fetchTransactions(debouncedSearch, statusFilter, currentCursor)
              }
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {transactions.length} of {totalItems} transactions
          </div>
        )}
      </div>

      {loading && transactions.length === 0 ? (
        <CardContent className="py-10">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      ) : transactions.length === 0 ? (
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground">
              No transactions match your search criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setCurrentCursor(null)
                updateUrl("", "all", null)
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obverse</TableHead>
                  <TableHead>Reverse</TableHead>
                  <TableHead>Upload At</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className="font-medium">
                      <Image
                        alt="Obverse image"
                        src={transaction.obverse}
                        width={100}
                        height={100}
                      />
                      {/* {transaction.obverse} */}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Image
                        alt="Reverse image"
                        src={transaction.reverse}
                        width={100}
                        height={100}
                      />
                      {/* {transaction.reverse} */}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.uploadedAt}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/transactions/${transaction._id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/transactions/${transaction._id}/edit`}
                              className="flex items-center"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center text-destructive focus:text-destructive"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the transaction.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {}}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>

          {(prevCursor !== null || nextCursor !== null) && (
            <div className="p-4 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span>
                    Showing {transactions.length} items
                    {nextCursor ? " (more available)" : " (end of results)"}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevTransaction}
                  disabled={!prevCursor && currentCursor === null}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextTransaction}
                  disabled={!nextCursor}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
