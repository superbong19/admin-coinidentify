import { BaseListResponse } from "@/types/base-list-response"
import { Coin } from "@/types/coin"

import axiosClient from "./axios-client"

export type CoinResponse = BaseListResponse<Coin>

export const coinsService = {
  async getCoins(
    page: number,
    limit: number,
    name?: string,
    country?: string
  ): Promise<CoinResponse> {
    const res = await axiosClient.get("admin/coins", {
      params: {
        page,
        limit,
        name,
        country,
      },
    })
    return res.data
  },

  async getCoinById(coinId: string): Promise<Coin> {
    const res = await axiosClient.get(`coins/${coinId}/details`)
    return res.data
  },

  async updateCoin(coinId: string, coinData: Partial<Coin>): Promise<Coin> {
    const res = await axiosClient.put(`admin/coins/${coinId}`, coinData)
    return res.data
  },
}
