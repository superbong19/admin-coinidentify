"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { Coin } from "@/types/coin"
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
  id: z.string().optional(),
  name: z.string().optional(),
  backImage: z.string().optional(),
  frontImage: z.string().optional(),
  period: z.string().optional(),
  country: z.string().optional(),
  coinType: z.string().optional(),
  inCirculation: z.boolean(),
  yearOfMinting: z.string().optional(),
  designDate: z.string().optional(),
  denomination: z.string().optional(),
  composition: z.string().optional(),
  weight: z.string().optional(),
  diameter: z.string().optional(),
  thickness: z.string().optional(),
  shape: z.string().optional(),
  krauseNumber: z.string().optional(),
  obverse: z.string().optional(),
  reverse: z.string().optional(),
  lettering: z.string().optional(),
  designer: z.string().optional(),
  edge: z.string().optional(),
  referencePrice: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  category: z.string().optional(),
  catalogIds: z.array(z.string()),
  officalSeriesIds: z.array(z.string()),
  obverseLettering: z.string().optional(),
  reverseLettering: z.string().optional(),
  rarity: z.number().optional().nullable(),
  rarityReason: z.string().optional(),
  mintage: z.string().optional(),
  meltPrice: z.string().optional(),
  fineness: z.string().optional(),
  pure: z.string().optional(),
})
type FormValues = z.infer<typeof formSchema>

interface CoinFormProps {
  id?: string
}

export function CoinForm({ id }: CoinFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  useEffect(() => {
    if (id) {
      const fetchCoin = async () => {
        try {
          const response = await fetch(`/api/coins/${id}`)
          console.log(response)

          if (!response.ok) {
            throw new Error("Failed to fetch coin")
          }
          const coin: Coin = await response.json()
          form.reset({
            id: coin.id,
            name: coin.name,
            frontImage: coin.imgCoin[0],
            backImage: coin.imgCoin[1],
            period: coin.period,
            country: coin.country,
            coinType: coin.coinType,
            inCirculation: coin.inCirculation,
            yearOfMinting: coin.yearOfMinting,
            designDate: coin.designDate,
            denomination: coin.denomination,
            composition: coin.composition,
            weight: coin.weight,
            diameter: coin.diameter,
            thickness: coin.thickness,
            shape: coin.shape,
            krauseNumber: coin.krauseNumber,
            obverse: coin.obverse,
            reverse: coin.reverse,
            lettering: coin.lettering,
            designer: coin.designer,
            edge: coin.edge,
            referencePrice: coin.referencePrice,
            description: coin.description,
            url: coin.url,
            category: coin.category,
            catalogIds: coin.catalogIds,
            officalSeriesIds: coin.officalSeriesIds,
            obverseLettering: coin.obverseLettering,
            reverseLettering: coin.reverseLettering,
            rarity: coin.rarity,
            rarityReason: coin.rarityReason,
            mintage: coin.mintage,
            meltPrice: coin.meltPrice,
            fineness: coin.fineness,
            pure: coin.pure,
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load coin data. Please try again.",
          })
        } finally {
          setInitialLoading(false)
        }
      }

      fetchCoin()
    }
  }, [id, form])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    values.rarity = values.rarity ? Number(values.rarity) : null
    try {
      const url = id ? `/api/coins/${id}` : "/api/coins"
      const method = id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${id ? "update" : "create"} coin`)
      }

      toast({
        title: `Coin ${id ? "updated" : "created"}`,
        description: `The coin has been successfully ${id ? "updated" : "created"}.`,
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} coin. Please try again.`,
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
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
                    <Input placeholder="Enter coin name" {...field} />
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
              name="backImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Back Images</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URLs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Period */}
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter period" {...field} />
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
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Coin Type */}
            <FormField
              control={form.control}
              name="coinType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coin Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter coin type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* In Circulation */}
            <FormField
              control={form.control}
              name="inCirculation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>In Circulation</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select circulation status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year of Minting */}
            <FormField
              control={form.control}
              name="yearOfMinting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Minting</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter year of minting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Design Date */}
            <FormField
              control={form.control}
              name="designDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Design Date</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter design date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Denomination */}
            <FormField
              control={form.control}
              name="denomination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Denomination</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter denomination" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Composition */}
            <FormField
              control={form.control}
              name="composition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Composition</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter composition" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter weight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Diameter */}
            <FormField
              control={form.control}
              name="diameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diameter</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter diameter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thickness */}
            <FormField
              control={form.control}
              name="thickness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thickness</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter thickness" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shape */}
            <FormField
              control={form.control}
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shape</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shape" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Krause Number */}
            <FormField
              control={form.control}
              name="krauseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Krause Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter krause number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Obverse */}
            <FormField
              control={form.control}
              name="obverse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obverse</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter obverse details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reverse */}
            <FormField
              control={form.control}
              name="reverse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reverse</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter reverse details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lettering */}
            <FormField
              control={form.control}
              name="lettering"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lettering</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lettering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Designer */}
            <FormField
              control={form.control}
              name="designer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter designer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Edge */}
            <FormField
              control={form.control}
              name="edge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edge</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter edge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reference Price */}
            <FormField
              control={form.control}
              name="referencePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reference price" {...field} />
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
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Catalog IDs */}
            <FormField
              control={form.control}
              name="catalogIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catalog IDs (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter catalog IDs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Official Series IDs */}
            <FormField
              control={form.control}
              name="officalSeriesIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Series IDs (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter official series IDs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Obverse Lettering */}
            <FormField
              control={form.control}
              name="obverseLettering"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obverse Lettering</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter obverse lettering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reverse Lettering */}
            <FormField
              control={form.control}
              name="reverseLettering"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reverse Lettering</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reverse lettering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rarity */}
            <FormField
              control={form.control}
              name="rarity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rarity (1-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter rarity"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value
                        const numberValue = value === "" ? null : Number(value)

                        if (numberValue === null) {
                          field.onChange(null)
                        } else if (numberValue >= 1 && numberValue <= 5) {
                          field.onChange(numberValue)
                        }
                      }}
                      min={1}
                      max={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rarity Reason */}
            <FormField
              control={form.control}
              name="rarityReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rarity Reason</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter rarity reason" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mintage */}
            <FormField
              control={form.control}
              name="mintage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mintage</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mintage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Melt Price */}
            <FormField
              control={form.control}
              name="meltPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Melt Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter melt price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fineness */}
            <FormField
              control={form.control}
              name="fineness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fineness</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter fineness" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pure */}
            <FormField
              control={form.control}
              name="pure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pure</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter pure" {...field} />
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
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    {id ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{id ? "Update" : "Create"} Coin</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
