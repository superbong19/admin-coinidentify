// import { BaseResponse } from "@/types/base-list-response"
// import { Game } from "@/types/game"

// import axiosClient from "./axios-client"

// export type HotGameResponse = BaseResponse<Game[]>
// export type GameResponse = BaseResponse<Game>

// export const gameService = {
//   async getGames(): Promise<HotGameResponse> {
//     const res = await axiosClient.get("/game/active")
//     return res.data
//   },

//   async getGameById(gameId: string): Promise<GameResponse> {
//     const res = await axiosClient.get(`/game/${gameId}`)
//     return res.data
//   },
// }
