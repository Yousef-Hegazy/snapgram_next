import { ID } from 'appwrite'
import { appwriteConfig, storage } from '@/appwrite/config'

export async function uploadFile(file: File) {
  const uploadedFile = await storage.createFile({
    bucketId: appwriteConfig.storageId,
    fileId: ID.unique(),
    file,
  })

  if (!uploadedFile.$id) throw new Error('File upload failed')

  return uploadedFile
}

export async function deleteFile(fileId: string) {
  await storage.deleteFile({
    bucketId: appwriteConfig.storageId,
    fileId,
  })
}
