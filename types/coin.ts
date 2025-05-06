export interface Coin {
  id: string
  name: string
  imgCoin: string[]
  period: string
  country: string
  coinType: string
  inCirculation: boolean
  yearOfMinting: string
  designDate: string
  denomination: string
  composition: string
  weight: string
  diameter: string
  thickness: string
  shape: string
  krauseNumber: string
  obverse: string
  reverse: string
  lettering: string
  designer: string
  edge: string
  referencePrice: string
  description: string
  url: string
  category: string
  catalogIds: string[]
  officalSeriesIds: string[]
  obverseLettering: string
  reverseLettering: string
  rarity: number | null
  rarityReason: string
  mintage: string
  meltPrice: string
  fineness: string
  pure: string
}

export interface CreateCoinDto {
  id: string
  name: string
  frontImage: string
  backImage: string
  period: string
  country: string
  coinType: string
  inCirculation: boolean
  yearOfMinting: string
  designDate: string
  denomination: string
  composition: string
  weight: string
  diameter: string
  thickness: string
  shape: string
  krauseNumber: string
  obverse: string
  reverse: string
  lettering: string
  designer: string
  edge: string
  referencePrice: string
  description: string
  url: string
  category: string
  catalogIds: string[]
  officalSeriesIds: string[]
  obverseLettering: string
  reverseLettering: string
  rarity: number | null
  rarityReason: string
  mintage: string
  meltPrice: string
  fineness: string
  pure: string
}

export interface UpdateCoinDto {
  id: string
  name: string
  frontImage: string
  backImage: string
  period: string
  country: string
  coinType: string
  inCirculation: boolean
  yearOfMinting: string
  designDate: string
  denomination: string
  composition: string
  weight: string
  diameter: string
  thickness: string
  shape: string
  krauseNumber: string
  obverse: string
  reverse: string
  lettering: string
  designer: string
  edge: string
  referencePrice: string
  description: string
  url: string
  category: string
  catalogIds: string[]
  officalSeriesIds: string[]
  obverseLettering: string
  reverseLettering: string
  rarity: number | null
  rarityReason: string
  mintage: string
  meltPrice: string
  fineness: string
  pure: string
}
