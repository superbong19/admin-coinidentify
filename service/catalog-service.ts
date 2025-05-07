import { BaseListResponse } from "@/types/base-list-response"
import { Catalog } from "@/types/catalog"

import axiosClient from "./axios-client"

export type CatalogResponse = BaseListResponse<Catalog>

export const catalogsService = {
  async getCatalogs(
    page: number,
    limit: number,
    name?: string,
    country?: string
  ): Promise<CatalogResponse> {
    const res = await axiosClient.get("admin/catalogs", {
      params: {
        page,
        limit,
        name,
        country,
      },
    })
    return res.data
  },

  async getCatalogById(catalogId: string): Promise<Catalog> {
    const res = await axiosClient.get(`catalogs/${catalogId}/details`)
    return res.data
  },

  async updateCatalog(
    catalogId: string,
    catalogData: Partial<Catalog>
  ): Promise<Catalog> {
    const res = await axiosClient.put(
      `admin/catalogs/${catalogId}`,
      catalogData
    )
    return res.data
  },
}
