// import { User } from "@/types/user"

// import axiosClient from "./axios-client"

// export const userService = {
//   async getUsers(): Promise<User[]> {
//     const res = await axiosClient.get("/users")
//     return res.data
//   },

//   async getUserById(id: number): Promise<User> {
//     const res = await axiosClient.get(`/users/${id}`)
//     return res.data
//   },

//   async addUser(user: Partial<User>): Promise<User> {
//     const res = await axiosClient.post("/users", user)
//     return res.data
//   },

//   async updateUser(id: number, user: Partial<User>): Promise<User> {
//     const res = await axiosClient.put(`/users/${id}`, user)
//     return res.data
//   },

//   async deleteUser(id: number): Promise<void> {
//     await axiosClient.delete(`/users/${id}`)
//   },
// }
