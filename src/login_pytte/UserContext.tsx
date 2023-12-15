import "firebase/analytics"
import { FirebaseApp, initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import React, { createContext, FC, useRef, useState } from "react"
import { useHistory } from "react-router"
import { io, Socket } from "socket.io-client"
import { UserData } from "../shared/schemaTypes"

interface Session {
  socket: Socket
  fireApp: FirebaseApp
  setUser: (
    user?: UserData | ((user: UserData) => UserData | undefined)
  ) => Promise<void>
  getUserData: () => Promise<UserData>
  signOut: () => void
}

const firebaseConfig = {
  apiKey: "AIzaSyCGJmBTvXSnljXMzqQiPXszj2wFT6gMxj8",
  authDomain: "pytte-76dab.firebaseapp.com",
  projectId: "pytte-76dab",
  storageBucket: "pytte-76dab.appspot.com",
  messagingSenderId: "581048708575",
  appId: "1:581048708575:web:998396a846b3fb44a7286a",
  measurementId: "G-VYHWXCJQH8",
}
const firebase = initializeApp(firebaseConfig, "pytte")
const _socket = io()

const UserContext = createContext<Session>({} as Session)

export const UserContextProvider: FC = ({ children }) => {
  const [socket] = useState(_socket)
  const [fireApp] = useState(firebase)
  const userData = useRef<UserData>()
  const history = useHistory()
  const auth = getAuth(fireApp)

  const getUserData = () =>
    new Promise<UserData>((resolve, reject) => {
      if (userData.current) resolve(userData.current)
      else {
        const unlisten = onAuthStateChanged(auth, user => {
          if (user) {
            // TODO: Move to storage api
            socket.emit("getOrCreateUserData", user, (data: UserData) => {
              userData.current = data
              resolve(data)
              unlisten()
            })
          } else {
            history.push("/login")
          }
        })
      }
    })

  async function setUser(
    user?: UserData | ((user: UserData) => UserData | undefined)
  ) {
    if (typeof user === "function") {
      console.log("func time")
      userData.current = user(await getUserData())
    } else if (typeof user === "object" || typeof user === "undefined") {
      userData.current = user
    }

    if (userData.current)
      socket.emit("updateUser", userData.current._id, userData.current, () =>
        console.log("User updated on server")
      )
  }

  const signOut = async () => {
    const auth = getAuth(fireApp)
    await auth.signOut()
    userData.current = undefined
    history.push("/login")
  }

  return (
    <UserContext.Provider
      value={{
        socket,
        setUser,
        getUserData,
        fireApp,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
