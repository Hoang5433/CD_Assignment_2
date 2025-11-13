import { api } from "../utils/api"

export const authService = {
    logIn: async (username, password) => {
        const res = await api.post(
          "/auth/login",
          { username, password },
          { withCredentials: true }
        )
        return res.data
    },

    fetchUser: async (userId) => {
      const res = await api.get(
        '/profile'
      )

      return res.data
    },
}

