import { account, appwriteConfig, database, storage } from '@/appwrite/config'
import type { Follows, Saves, Users } from '@/appwrite/types/appwrite'
import type { IUpdateUser } from '@/types'
import { ID, ImageGravity, Query } from 'appwrite'
import { deleteFile, uploadFile } from './storageUtils'

export async function getUsers(limit?: number) {
  const queries = [
    Query.orderDesc('postCount'),
    Query.select(['*', 'followers.follower']),
  ]

  if (limit) {
    queries.push(Query.limit(limit))
  }

  const users = await database.listRows<Users>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    queries,
  })

  return users.rows
}

export async function getUserById(userId: string) {
  const user = await database.getRow<Users>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: userId,
    queries: [Query.select(['*', 'followers.follower'])],
  })

  return user
}

export async function getUserForEdit(userId: string) {
  const user = await database.getRow<Users>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: userId,
  })

  return user
}

export async function getInfiniteUsers(lastId?: string, limit?: number) {
  const queries = [
    Query.orderDesc('postCount'),
    Query.limit(limit || 10),
    Query.select(['*', 'followers.follower']),
  ]

  if (lastId && lastId !== '0') {
    queries.push(Query.cursorAfter(lastId))
  }

  const users = await database.listRows<Users>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    queries,
  })

  return users
}

export async function removeFollow(
  followId: string,
  userId: string,
  followerId: string,
) {
  await database.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.followsTableId,
    rowId: followId,
  })

  await database.decrementRowColumn({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: userId,
    column: 'followersCount',
    value: 1,
  })

  await database.decrementRowColumn({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: followerId,
    column: 'followeesCount',
    value: 1,
  })

  return null
}

export async function addFollow(userId: string, followerId: string) {
  const follow = await database.createRow<Follows>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.followsTableId,
    rowId: ID.unique(),
    data: {
      followee: userId as unknown as Users,
      follower: followerId as unknown as Users,
    },
  })

  if (!follow.$id) {
    throw new Error('Failed to follow user')
  }

  await database.incrementRowColumn({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: userId,
    column: 'followersCount',
    value: 1,
  })

  await database.incrementRowColumn({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: followerId,
    column: 'followeesCount',
    value: 1,
  })

  return follow
}

export async function toggleFollow(userId: string, followerId: string) {
  const existingFollow = await database.listRows<Follows>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.followsTableId,
    queries: [
      Query.equal('followee', userId),
      Query.equal('follower', followerId),
    ],
  })

  if (existingFollow.total > 0) {
    return await removeFollow(existingFollow.rows[0].$id, userId, followerId)
  } else {
    return await addFollow(userId, followerId)
  }
}

export async function getInfiniteSavedPostsByUser(
  userId: string,
  lastId: string,
  limit?: number,
) {
  const queries = [
    Query.equal('user', userId),
    Query.orderDesc('$createdAt'),
    Query.limit(limit || 20),
    Query.select(['post.*', 'post.creator.*', 'post.likes.user']),
  ]

  if (lastId && lastId !== '0') {
    queries.push(Query.cursorAfter(lastId))
  }

  const saves = await database.listRows<Saves>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.savesTableId,
    queries,
  })

  return saves
}

export async function getInfiniteLikedPostsByUser(
  userId: string,
  lastId: string,
  limit?: number,
) {
  const queries = [
    Query.equal('user', userId),
    Query.orderDesc('$createdAt'),
    Query.limit(limit || 20),
    Query.select(['post.*', 'post.creator.*', 'post.save.user']),
  ]

  if (lastId && lastId !== '0') {
    queries.push(Query.cursorAfter(lastId))
  }

  const likes = await database.listRows<any>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.likesTableId,
    queries,
  })

  return likes
}

export async function getInfiniteFollowers(
  userId: string,
  lastId: string,
  limit?: number,
) {
  const queries = [
    Query.equal('followee', userId),
    Query.orderDesc('$createdAt'),
    Query.limit(limit || 20),
    Query.select(['follower.*', 'follower.followers.follower']),
  ]

  if (lastId && lastId !== '0') {
    queries.push(Query.cursorAfter(lastId))
  }

  const followers = await database.listRows<Follows>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.followsTableId,
    queries,
  })

  return followers
}

export async function getInfiniteFollowings(
  userId: string,
  lastId: string,
  limit?: number,
) {
  const queries = [
    Query.equal('follower', userId),
    Query.orderDesc('$createdAt'),
    Query.limit(limit || 20),
    Query.select(['followee.*']),
  ]

  if (lastId && lastId !== '0') {
    queries.push(Query.cursorAfter(lastId))
  }

  const followers = await database.listRows<Follows>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.followsTableId,
    queries,
  })

  return followers
}

export async function updateUser(user: IUpdateUser) {
  const { $id: accountId } = await account.get()

  if (user.userId !== accountId) {
    throw new Error('Unauthorized')
  }

  const dbUser = await database.getRow<Users>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: user.userId,
  })

  const image = {
    id: dbUser.imageId,
    url: dbUser.imageUrl,
  }

  if (user.file) {
    if (dbUser.imageId) {
      await deleteFile(dbUser.imageId)
    }

    const uploadedFile = await uploadFile(user.file)
    image.id = uploadedFile.$id
    image.url = storage.getFilePreview({
      bucketId: appwriteConfig.storageId,
      fileId: uploadedFile.$id,
      height: 2000,
      width: 2000,
      gravity: ImageGravity.Top,
      quality: 100,
    })
  }

  const updatedUser = await database.updateRow<Users>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    rowId: user.userId,
    data: {
      name: user.name,
      bio: user.bio,
      imageId: image.id,
      imageUrl: image.url,
    },
  })

  if (!updatedUser.$id) {
    throw new Error('Failed to update user')
  }

  return updatedUser
}
