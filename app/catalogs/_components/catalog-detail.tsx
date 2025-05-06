"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash } from "lucide-react"

import { Catalog } from "@/types/catalog"
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

interface CatalogDetailProps {
  id: string
}

export function CatalogDetail({ id }: CatalogDetailProps) {
  const router = useRouter()
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch(`/api/catalogs/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch catalog")
        }
        const data = await response.json()
        setCatalog(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load catalog details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCatalog()
  }, [id])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/catalogs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete catalog")
      }

      toast({
        title: "Catalog deleted",
        description: "The catalog has been successfully deleted.",
      })

      router.push("/")
      router.refresh()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete catalog. Please try again.",
      })
    }
  }

  if (loading) {
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

  if (error || !catalog) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error || "Catalog not found"}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/")}
            >
              Back to Catalogs
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
            <CardTitle className="text-2xl">{catalog.name}</CardTitle>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-4">
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">{catalog.country}</div>
                  </div>
                </CardContent>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{catalog.coinCount}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/catalogs/${id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  catalog.
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
