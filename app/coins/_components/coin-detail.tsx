"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { coinsService } from "@/service/coin-service"
import { Pencil, Trash } from "lucide-react"

import { Coin } from "@/types/coin"
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CoinDetailProps {
  id: string
}

export function CoinDetail({ id }: CoinDetailProps) {
  const router = useRouter()
  const [coin, setCoin] = useState<Coin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await coinsService.getCoinById(id)
        setCoin(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load coin details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCoin()
  }, [id])

  const handleDelete = async () => {}

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

  if (error || !coin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error || "Coin not found"}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/")}
            >
              Back to Coins
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{coin.name}</CardTitle>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-4">
                <Badge variant="default">{coin.country}</Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date(coin.coinType).toLocaleString()}
                </span>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Coin type:</strong> {coin.coinType}
            </div>
            <div>
              <strong>In circulation:</strong>{" "}
              {coin.inCirculation ? "Yes" : "No"}
            </div>
            <div>
              <strong>Year of minting:</strong> {coin.yearOfMinting}
            </div>
            <div>
              <strong>Design date:</strong> {coin.designDate}
            </div>
            <div>
              <strong>Denomination:</strong> {coin.denomination}
            </div>
            <div>
              <strong>Composition:</strong> {coin.composition}
            </div>
            <div>
              <strong>Weight:</strong> {coin.weight}
            </div>
            <div>
              <strong>Diameter:</strong> {coin.diameter}
            </div>
            <div>
              <strong>Thickness:</strong> {coin.thickness}
            </div>
            <div>
              <strong>Shape:</strong> {coin.shape}
            </div>
            <div>
              <strong>Krause number:</strong> {coin.krauseNumber}
            </div>
            <div>
              <strong>Obverse:</strong> {coin.obverse}
            </div>
            <div>
              <strong>Reverse:</strong> {coin.reverse}
            </div>
            <div>
              <strong>Lettering:</strong> {coin.lettering}
            </div>
            <div>
              <strong>Designer:</strong> {coin.designer}
            </div>
            <div>
              <strong>Edge:</strong> {coin.edge}
            </div>
            <div>
              <strong>Reference price:</strong> {coin.referencePrice}
            </div>
            <div className="md:col-span-2">
              <strong>Description:</strong> {coin.description}
            </div>
            <div>
              <strong>URL:</strong> {coin.url}
            </div>
            <div>
              <strong>Category:</strong> {coin.category}
            </div>
            <div>
              <strong>Catalog IDs:</strong> {coin.catalogIds.join(", ")}
            </div>
            <div>
              <strong>Official series IDs:</strong>{" "}
              {coin.officalSeriesIds.join(", ")}
            </div>
            <div>
              <strong>Obverse lettering:</strong> {coin.obverseLettering}
            </div>
            <div>
              <strong>Reverse lettering:</strong> {coin.reverseLettering}
            </div>
            <div>
              <strong>Rarity:</strong> {coin.rarity}
            </div>
            <div>
              <strong>Rarity reason:</strong> {coin.rarityReason}
            </div>
            <div>
              <strong>Mintage:</strong> {coin.mintage}
            </div>
            <div>
              <strong>Melt price:</strong> {coin.meltPrice}
            </div>
            <div>
              <strong>Fineness:</strong> {coin.fineness}
            </div>
            <div>
              <strong>Pure:</strong> {coin.pure}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="text-sm text-muted-foreground">
          Created: {new Date(coin.country).toLocaleString()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/coins/${id}/edit`)}
          >
            <Pencil className="size-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="size-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  coin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  )
}
