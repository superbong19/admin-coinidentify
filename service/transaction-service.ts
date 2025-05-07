import { BaseListResponse } from "@/types/base-list-response"
import { Transaction } from "@/types/transaction"

import axiosClient from "./axios-client"

export type TransactionResponse = BaseListResponse<Transaction>

export const transactionsService = {
  async getTransactions(
    page: number,
    limit: number,
    name?: string,
    country?: string
  ): Promise<TransactionResponse> {
    const res = await axiosClient.get("admin/transactions", {
      params: {
        page,
        limit,
        name,
        country,
      },
    })
    return res.data
  },

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const res = await axiosClient.get(`transactions/${transactionId}/details`)
    return res.data
  },

  async updateTransaction(
    transactionId: string,
    transactionData: Partial<Transaction>
  ): Promise<Transaction> {
    const res = await axiosClient.put(
      `admin/transactions/${transactionId}`,
      transactionData
    )
    return res.data
  },
}
