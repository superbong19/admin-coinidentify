import axiosClient from "./axios-client"

export const uploadService = {
  async upload(file: File): Promise<any> {
    const fileType = file.type
    const fileSize = file.size
    const res = await axiosClient.put(
      "https://safilesdeve0ql3.blob.core.windows.net/roombees-dev-user/9738082d-3a1a-4f25-8321-5fa5c5dec484-string?sv=2025-01-05&se=2025-03-27T02%3A53%3A10Z&sr=b&sp=c&sig=SwZ8jLycybyhYTRQDEHOP162Q0xHnUNztUDFC57it9s%3D",
      file,
      {
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Length": fileSize.toString(),
          "Content-Type": fileType,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    )
    return res.data
  },
}
