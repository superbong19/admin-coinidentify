"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash } from "lucide-react"

import { OfficalSeries } from "@/types/offical-series"
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

interface OfficalSeriesDetailProps {
  id: string
}

export function OfficalSeriesDetail({ id }: OfficalSeriesDetailProps) {
  const router = useRouter()
  const [officalSeries, setOfficalSeries] = useState<OfficalSeries | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOfficalSeries = async () => {
      try {
        const response = await fetch(`/api/officalSeriess/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch officalSeries")
        }
        const data = await response.json()
        setOfficalSeries(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Failed to load officalSeries details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOfficalSeries()
  }, [id])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/officalSeriess/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete officalSeries")
      }

      toast({
        title: "OfficalSeries deleted",
        description: "The officalSeries has been successfully deleted.",
      })

      router.push("/")
      router.refresh()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete officalSeries. Please try again.",
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

  if (error || !officalSeries) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error || "OfficalSeries not found"}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/")}
            >
              Back to OfficalSeriess
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
            <CardTitle className="text-2xl">{officalSeries.name}</CardTitle>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-4">
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">
                      {officalSeries.country}
                    </div>
                  </div>
                </CardContent>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{officalSeries.coinCount}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/officalSeriess/${id}/edit`)}
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
                  officalSeries.
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
