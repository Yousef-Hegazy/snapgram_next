import { ID, Query } from 'appwrite'
import { account, appwriteConfig, avatars, database } from '@/appwrite/config'
import type { Users } from '@/appwrite/types/appwrite'

import type { INewUser } from '@/types'

export async function createUserAccount(user: INewUser) {
  const newAccount = await account.create({
    userId: ID.unique(),
    email: user.email,
    password: user.password,
    name: user.name,
  })

  console.log('Account created')

  if (!newAccount.$id) throw new Error('Failed to create account')

  const avatarUrl = avatars.getInitials({
    name: user.name,
  })

  console.log('User saved to database')

  const newUser = await saveUserToDB({
    id: newAccount.$id,
    email: newAccount.email,
    name: newAccount.name,
    username: user.username,
    imageUrl: avatarUrl,
    password: user.password,
  })

  if (!newUser.$id) throw new Error('Failed to save user to database')

  return newUser
}

export async function saveUserToDB(user: {
  id: string
  email: string
  name: string
  imageUrl: string
  username?: string
  password: string
}) {
  try {
    await account.createEmailPasswordSession({
      email: user.email,
      password: user.password,
    })

    const newUser = await database.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      rowId: user.id,
      data: {
        email: user.email,
        name: user.name,
        username: user.username || '',
        imageUrl: user.imageUrl,
      },
    })

    return newUser as unknown as Users
  } catch (error) {
    console.log(error, 'saveUserToDB')
    throw error
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  const session = await account.createEmailPasswordSession({
    email: user.email,
    password: user.password,
  })

  if (session.$id) {
    const currentUser = await getCurrentUser()
    return currentUser
  }

  throw new Error('Failed to sign in')
}

export async function logout() {
  await account.deleteSession({
    sessionId: 'current',
  })
}

export async function getUserByAccountId(accountId: string) {
  try {
    const currentUser = await database.getRow<Users>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      rowId: accountId,
      queries: [Query.select(['*', 'followers.$id', 'followees.$id'])],
    })
    return currentUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getIsLoggedIn(): Promise<boolean> {
  try {
    const ac = await account.get()
    return !!ac.$id
  } catch {
    return false
  }
}

export async function getCurrentUser() {
  const { $id } = await account.get()
  const user = await getUserByAccountId($id)
  return user
}
