"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { coinFilterList } from "@/constants/list-filter"
import { coinsService } from "@/service/coin-service"
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

import type { Coin } from "@/types/coin"
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

export function CoinList({
  catalogId,
  officalSeriesId,
}: {
  catalogId?: string
  officalSeriesId?: string
}) {
  const router = useRouter()
  // Pagination settings
  const [limit, setLimit] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  // Local state
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Update URL with current filters and pagination
  const updateUrl = (
    search: string,
    status: string,
    page: number,
    pageLimit: number
  ) => {
    fetchCoins(search, status, page, pageLimit)
  }

  // Fetch coins with filters and pagination
  const fetchCoins = async (
    search: string,
    status: string,
    page: number,
    pageLimit: number
  ) => {
    setLoading(true)
    try {
      const response = await coinsService.getCoins({
        page,
        limit: pageLimit,
        name: search,
        country: status,
        catalogId,
        officalSeriesId,
      })
      const data = response.data
      setCoins(data)
      setTotalItems(response.total || 0)

      // Calculate total pages
      const calculatedTotalPages = Math.ceil((response.total || 0) / pageLimit)
      setTotalPages(calculatedTotalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load coins. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setStatusFilter("")
    } else setStatusFilter(value)
    setCurrentPage(1) // Reset to first page on new filter
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Handle limit change
  const handleLimitChange = (value: string) => {
    const newLimit = parseInt(value, 10)
    setLimit(newLimit)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // Effect to fetch data when filters or pagination change
  useEffect(() => {
    fetchCoins(debouncedSearch, statusFilter, currentPage, limit)
    updateUrl(debouncedSearch, statusFilter, currentPage, limit)
  }, [debouncedSearch, statusFilter, currentPage, limit])

  if (loading && coins.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && coins.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                fetchCoins(debouncedSearch, statusFilter, currentPage, limit)
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
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search coins..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {coinFilterList.map((country) => (
                  <SelectItem value={country}>{country}</SelectItem>
                ))}
                {/* Other country options */}
              </SelectContent>
            </Select>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {coins.length} of {totalItems} coins
          </div>
        )}
      </div>

      {loading && coins.length === 0 ? (
        <CardContent className="py-10">
          <div className="flex justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      ) : coins.length === 0 ? (
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground">
              No coins match your search criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setCurrentPage(1)
                updateUrl("", "all", 1, limit)
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
                  <TableHead>Name</TableHead>
                  <TableHead>Obverse</TableHead>
                  <TableHead>Reverse</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>ReferencePrice</TableHead>
                  <TableHead>Url</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coins.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell className="font-medium">{coin.name}</TableCell>
                    <TableCell className="font-medium">
                      <Image
                        alt="Obverse image"
                        src={coin.imgCoin[0]}
                        width={100}
                        height={100}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Image
                        alt="Reverse image"
                        src={coin.imgCoin[1]}
                        width={100}
                        height={100}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {coin.country}
                    </TableCell>
                    <TableCell className="font-medium">
                      {coin.referencePrice}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={
                          coin.url ||
                          "https://s3.amazonaws.com/collectors-society-production/Coins/Census/Categories/placeholder.png"
                        }
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        Click
                      </Link>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/coins/${coin.id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/coins/${coin.id}/edit`}
                              className="flex items-center"
                            >
                              <Pencil className="mr-2 size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center text-destructive focus:text-destructive"
                              >
                                <Trash className="mr-2 size-4" />
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
                                  permanently delete the coin.
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

          <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Items per page:
              </span>
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="size-4 mr-1" />
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <div className="flex items-center gap-1 px-2">
                <span className="text-sm">Page</span>
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10)
                    if (!isNaN(value) && value >= 1 && value <= totalPages) {
                      handlePageChange(value)
                    }
                  }}
                  className="w-14 h-8 text-center"
                />
                <span className="text-sm">of {totalPages}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
              >
                Last
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
