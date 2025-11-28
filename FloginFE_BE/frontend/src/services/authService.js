import {api} from "../utils/api"
import {getJWTfromCookie} from "../utils/cookie";

export const authService = {
    logIn: async (username, password) => {
        const res = await api.post(
          "/auth/login",
          { username, password },
          { withCredentials: true }
        )
        return {
            success: true,
            token: res.data.accessToken,
            user: { username }
        }
    },

    fetchUser: async () => {
        const token = getJWTfromCookie();
      const res = await api.get(
        '/auth/profile'
          , {
              headers: {Authorization: `Bearer ${token}`}
          }
      )

      return res.data
    },
}
