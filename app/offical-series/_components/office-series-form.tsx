"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { officalSeriesService } from "@/service/offical-series-service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

import { OfficalSeries } from "@/types/offical-series"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().optional(),
  imgBackground: z.string().optional(),
  frontImage: z.string().optional(),
  description: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  country: z.string().optional(),
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
    defaultValues: {},
  })

  useEffect(() => {
    if (id) {
      const fetchOfficalSeries = async () => {
        try {
          const officalSeries: OfficalSeries =
            await officalSeriesService.getOfficalSeriesById(id)

          form.reset({
            name: officalSeries.name,
            frontImage: officalSeries.frontImage,
            imgBackground: officalSeries.imgBackground,
            description: officalSeries.description,
            startYear: officalSeries.startYear,
            endYear: officalSeries.endYear,
            country: officalSeries.country,
          })
        } catch (error) {
          toast.error("Failed to load offical-series data. Please try again.")
        } finally {
          setInitialLoading(false)
        }
      }

      fetchOfficalSeries()
    }
  }, [id, form])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    if (!id) {
      toast.error("OfficalSeries ID is required for update.")
      return
    }

    try {
      await officalSeriesService.updateOfficalSeries(id, values)

      toast.success(
        `The offical-series has been successfully ${id ? "updated" : "created"}.`
      )

      // router.push("/offical-seriess")
      // router.refresh()
    } catch (error) {
      toast.error(
        `Failed to ${id ? "update" : "create"} offical-series. Please try again.`
      )
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
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter offical-series name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter offical-series description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter offical-series country"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Year */}
            <FormField
              control={form.control}
              name="startYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter start year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* End Year */}
            <FormField
              control={form.control}
              name="endYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter end year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URLs */}
            <FormField
              control={form.control}
              name="frontImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Front Images</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URLs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imgBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Images</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URLs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit buttons */}
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
