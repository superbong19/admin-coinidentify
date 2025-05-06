"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash } from "lucide-react"

import { Page } from "@/types/page"
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

interface PageDetailProps {
  id: string
}

export function PageDetail({ id }: PageDetailProps) {
  const router = useRouter()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/pages/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch page")
        }
        const data = await response.json()
        setPage(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load page details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [id])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete page")
      }

      toast({
        title: "Page deleted",
        description: "The page has been successfully deleted.",
      })

      router.push("/")
      router.refresh()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete page. Please try again.",
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

  if (error || !page) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>{error || "Page not found"}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/")}
            >
              Back to Pages
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
            <CardTitle className="text-2xl">{page.title}</CardTitle>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    page.status === "published" ? "default" : "secondary"
                  }
                >
                  {page.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date(page.updatedAt).toLocaleString()}
                </span>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{page.content}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="text-sm text-muted-foreground">
          Created: {new Date(page.createdAt).toLocaleString()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/pages/${id}/edit`)}
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
                  page.
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
