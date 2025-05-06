import axios from "axios"

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Thêm Interceptor để tự động gắn Bearer Token
axiosClient.interceptors.request.use(
  (config) => {
    // const token = Cookies.get("token")
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Thêm Interceptor xử lý lỗi response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error API:", error)
    return Promise.reject(error)
  }
)

export default axiosClient
