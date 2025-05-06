"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { OfficalSeries } from "@/types/offical-series"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(1, "Title is required"),
  country: z.string().min(1, "Content is required"),
  coinCount: z.number(),
})

type FormValues = z.infer<typeof formSchema>

interface OfficalSeriesFormProps {
  id?: string
}

export function OfficalSeriesForm({ id }: OfficalSeriesFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      coinCount: 0,
    },
  })

  useEffect(() => {
    if (id) {
      const fetchOfficalSeries = async () => {
        try {
          const response = await fetch(`/api/offical-series/${id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch officalSeries")
          }
          const officalSeries: OfficalSeries = await response.json()
          form.reset({
            name: officalSeries.name,
            country: officalSeries.country,
            coinCount: officalSeries.coinCount,
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load officalSeries data. Please try again.",
          })
        } finally {
          setInitialLoading(false)
        }
      }

      fetchOfficalSeries()
    }
  }, [id, form])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const url = id ? `/api/offical-series/${id}` : "/api/offical-series"
      const method = id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${id ? "update" : "create"} officalSeries`)
      }

      toast({
        title: `OfficalSeries ${id ? "updated" : "created"}`,
        description: `The officalSeries has been successfully ${id ? "updated" : "created"}.`,
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} officalSeries. Please try again.`,
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
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

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter officalSeries title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title of your officalSeries as it will appear to users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter officalSeries content"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content of your officalSeries.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coinCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the current status of your officalSeries.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="size-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    {id ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{id ? "Update" : "Create"} OfficalSeries</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
