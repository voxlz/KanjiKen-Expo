import { Auth, getRedirectResult } from "@firebase/auth"
import { User } from "firebase/auth"
import { useEffect } from "react"
import { useHistory } from "react-router-dom"

export const useOAuthHandler = (
  auth: Auth,
  login: (firebaseUser: User | null) => void
) => {
  // When page loads, check if user just returned from redirect auth
  useEffect(() => {
    getRedirectResult(auth)
      .then(result => {
        if (result !== null) {
          login(result.user)
        } else console.log("Not redirected here")
      })
      .catch(error => alert("error" + error.message))
  }, [auth, login])
}

export const useRedirectSignedInUser = (auth: Auth) => {
  // If already logged in, get redirected
  const history = useHistory()

  useEffect(() => {
    const checkUser = async () => {
      if (auth.currentUser) {
        history.push("/reviews")
      }
    }
    checkUser()
  }, [auth.currentUser, history])
}
