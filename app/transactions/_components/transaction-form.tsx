"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { Transaction } from "@/types/transaction"
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
  obverse: z.string().min(1, "Title is required"),
  reverse: z.string().min(1, "Content is required"),
  uploadedAt: z.string().min(1, "Content is required"),
})

type FormValues = z.infer<typeof formSchema>

interface TransactionFormProps {
  id?: string
}

export function TransactionForm({ id }: TransactionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      obverse: "",
      reverse: "",
      uploadedAt: "",
    },
  })

  useEffect(() => {
    if (id) {
      const fetchTransaction = async () => {
        try {
          const response = await fetch(`/api/transactions/${id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch transaction")
          }
          const transaction: Transaction = await response.json()
          form.reset({
            obverse: transaction.obverse,
            reverse: transaction.reverse,
            uploadedAt: transaction.uploadedAt,
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load transaction data. Please try again.",
          })
        } finally {
          setInitialLoading(false)
        }
      }

      fetchTransaction()
    }
  }, [id, form])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const url = id ? `/api/transactions/${id}` : "/api/transactions"
      const method = id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${id ? "update" : "create"} transaction`)
      }

      toast({
        title: `Transaction ${id ? "updated" : "created"}`,
        description: `The transaction has been successfully ${id ? "updated" : "created"}.`,
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} transaction. Please try again.`,
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
              name="obverse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter transaction title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title of your transaction as it will appear to users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reverse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter transaction content"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content of your transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uploadedAt"
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
                    Set the current status of your transaction.
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
                  <>{id ? "Update" : "Create"} Transaction</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
