"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react"

import type { Coin } from "@/types/coin"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function CoinList() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/coins?limit=10`
        )
        const data = await response.data
        setCoins(data.data)
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

    fetchCoins()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/coins/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete coin")
      }

      setCoins(coins.filter((coin) => coin.id !== id))
      toast({
        title: "Coin deleted",
        description: "The coin has been successfully deleted.",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete coin. Please try again.",
      })
    }
  }

  if (loading) {
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

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (coins.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Coins Found</CardTitle>
          <CardDescription>
            Get started by creating your first coin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/coins/new">Create New Coin</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Url</TableHead>
                {/* <TableHead>Period</TableHead> */}
                {/* <TableHead>Coin Type</TableHead> */}
                {/* <TableHead>In Circulation</TableHead> */}
                {/* <TableHead>Year Of Minting</TableHead> */}
                {/* <TableHead>Design Date</TableHead> */}
                {/* <TableHead>Denomination</TableHead> */}
                {/* <TableHead>Composition</TableHead> */}
                {/* <TableHead>Weight</TableHead> */}
                {/* <TableHead>Diameter</TableHead> */}
                {/* <TableHead>Thickness</TableHead> */}
                {/* <TableHead>Shape</TableHead> */}
                {/* <TableHead>Krause Number</TableHead> */}
                {/* <TableHead>Rarity</TableHead> */}
                {/* <TableHead>Mintage</TableHead> */}
                {/* <TableHead>Reference Price</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coins.map((coin) => (
                <TableRow key={coin.id}>
                  <TableCell className="font-medium">{coin.id}</TableCell>
                  <TableCell className="font-medium">{coin.name}</TableCell>
                  <TableCell>{coin.country}</TableCell>
                  <TableCell>
                    <a href={coin.url}>{coin.url}</a>
                  </TableCell>
                  {/* <TableCell>{coin.period}</TableCell> 
                   <TableCell>
                    <Badge
                      variant={
                        coin.coinType === "published" ? "default" : "secondary"
                      }
                    >
                      {coin.coinType}
                    </Badge>
                  </TableCell>
                  <TableCell>{coin.inCirculation ? "Yes" : "No"}</TableCell>
                  <TableCell>{coin.yearOfMinting}</TableCell>
                  <TableCell>
                    {coin.designDate
                      ? new Date(coin.designDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{coin.denomination}</TableCell>
                  <TableCell>{coin.composition}</TableCell>
                  <TableCell>{coin.weight}</TableCell>
                  <TableCell>{coin.diameter}</TableCell>
                  <TableCell>{coin.thickness}</TableCell>
                  <TableCell>{coin.shape}</TableCell>
                  <TableCell>{coin.krauseNumber}</TableCell>
                  <TableCell>{coin.rarity}</TableCell>
                  <TableCell>{coin.mintage}</TableCell>
                  <TableCell>{coin.referencePrice}</TableCell> */}
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
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the coin.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(coin.id)}
                              >
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
      </Card>
    </Card>
  )
}
