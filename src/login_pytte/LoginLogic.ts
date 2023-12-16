import {
  Auth,
  GoogleAuthProvider,
  signInWithRedirect,
  TwitterAuthProvider,
} from "firebase/auth"

export const signInWithGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider()
  provider.addScope("profile")
  provider.addScope("email")
  await sing(auth, provider)
}

export const signInWithTwitter = async (auth: Auth) => {
  const provider = new TwitterAuthProvider()
  await signInWithRedirect(auth, provider)
}
