"use client"

import { useEffect, useState } from "react"
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

import { OfficalSeries } from "@/types/offical-series"
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

export function OfficalSeriesList() {
  const router = useRouter()

  // Get URL parameters with defaults
  const limit = 5 // Fixed officalSeries size

  // Local state
  const [officalSeriess, setOfficalSeriess] = useState<OfficalSeries[]>([])
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
    fetchOfficalSeriess(search, status, currentCursor)
  }

  // Fetch officalSeriess with filters and cursor pagination
  const fetchOfficalSeriess = async (
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
        url: "http://3.222.142.224:7799/api/offical-series",
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
      setOfficalSeriess(data.data)
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
        description: "Failed to load officalSeriess. Please try again.",
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

  // Handle next officalSeries
  const handleNextOfficalSeries = () => {
    if (nextCursor) {
      setPrevCursor(currentCursor)
      setCurrentCursor(nextCursor)
      fetchOfficalSeriess(debouncedSearch, statusFilter, nextCursor)
    }
  }

  // Handle previous officalSeries
  const handlePrevOfficalSeries = () => {
    if (prevCursor) {
      setCurrentCursor(prevCursor)
      fetchOfficalSeriess(debouncedSearch, statusFilter, prevCursor)
    } else {
      // Go to first officalSeries
      setCurrentCursor(null)
      updateUrl(debouncedSearch, statusFilter, null)
    }
  }

  // Effect to fetch data when filters or cursor change
  useEffect(() => {
    const isReset = currentCursor === null
    fetchOfficalSeriess(debouncedSearch, statusFilter, currentCursor, isReset)
    updateUrl(debouncedSearch, statusFilter, currentCursor)
  }, [debouncedSearch, statusFilter, currentCursor])

  if (loading && officalSeriess.length === 0) {
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

  if (error && officalSeriess.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                fetchOfficalSeriess(
                  debouncedSearch,
                  statusFilter,
                  currentCursor
                )
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
              placeholder="Search officalSeriess..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {officalSeriess.length} of {totalItems} officalSeriess
          </div>
        )}
      </div>

      {loading && officalSeriess.length === 0 ? (
        <CardContent className="py-10">
          <div className="flex justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      ) : officalSeriess.length === 0 ? (
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground">
              No officalSeriess match your search criteria.
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
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Coin count</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {officalSeriess.map((officalSeries) => (
                  <TableRow key={officalSeries.id}>
                    <TableCell className="font-medium">
                      {officalSeries.name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {officalSeries.country}
                    </TableCell>
                    <TableCell className="font-medium">
                      {officalSeries.coinCount}
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
                              href={`/officalSeriess/${officalSeries.id}`}
                              className="flex items-center"
                            >
                              <Eye className="mr-2 size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/officalSeriess/${officalSeries.id}/edit`}
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
                                  permanently delete the officalSeries.
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
                    Showing {officalSeriess.length} items
                    {nextCursor ? " (more available)" : " (end of results)"}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevOfficalSeries}
                  disabled={!prevCursor && currentCursor === null}
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextOfficalSeries}
                  disabled={!nextCursor}
                >
                  Next
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
