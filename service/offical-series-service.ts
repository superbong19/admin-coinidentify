import { BaseListResponse } from "@/types/base-list-response"
import { OfficalSeries } from "@/types/offical-series"

import axiosClient from "./axios-client"

export type OfficalSeriesResponse = BaseListResponse<OfficalSeries>

export const officalSeriesService = {
  async getOfficalSeries(
    page: number,
    limit: number,
    name?: string,
    country?: string
  ): Promise<OfficalSeriesResponse> {
    const res = await axiosClient.get("admin/offical-series", {
      params: {
        page,
        limit,
        name,
        country,
      },
    })
    return res.data
  },

  async getOfficalSeriesById(officalSeriesId: string): Promise<OfficalSeries> {
    const res = await axiosClient.get(`offical-series/${officalSeriesId}`)
    return res.data
  },

  async updateOfficalSeries(
    officalSeriesId: string,
    officalSeriesData: Partial<OfficalSeries>
  ): Promise<OfficalSeries> {
    const res = await axiosClient.put(
      `offical-series/${officalSeriesId}`,
      officalSeriesData
    )
    return res.data
  },
}
