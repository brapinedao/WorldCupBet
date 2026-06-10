import { defineStore } from 'pinia'

import { useUsers } from '@/composables/useUsers'
import type { IUser } from '@/interfaces/customs/auth/Auth'

interface IAuthState {
  id: number | null
  username: string
  display_name: string
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    id: null,
    username: '',
    display_name: '',
  }),
  persist: true,
  actions: {
    _setUser(user: IUser): void {
      this.id = user.id
      this.username = user.name
      this.display_name = user.display_name
    },

    _clearUser(): void {
      this.id = null
      this.username = ''
      this.display_name = ''
    },

    async _getUserByUsername(username: string): Promise<IUser | null> {
      const { findUserByName } = useUsers()
      return findUserByName(username)
    },
  },
})
