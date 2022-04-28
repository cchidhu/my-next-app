import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import Router from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { createUser } from './db'
import { auth } from './firebase'

const authContext = createContext()

export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser(rawUser)
      createUser(user.uid, user)
      setLoading(false)
      setUser(user)
      return user
    } else {
      setLoading(false)
      setUser(false)
      return false
    }
  }

  const signinWithGitHub = () => {
    setLoading(true)
    return signInWithPopup(auth, new GithubAuthProvider())
      .then((response) => handleUser(response.user))
  }

  const signinWithGoogle = (redirect) => {
    setLoading(true)
    return signInWithPopup(auth, new GoogleAuthProvider())
    .then((response)=>{
      handleUser(response.user)
      if(redirect) {
        Router.push(redirect)
      }
    })
  }

  const signout = async () => {
    await signOut(auth)
    return handleUser(false)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleUser)

    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    signinWithGitHub,
    signinWithGoogle,
    signout
  }
}

const formatUser = (user) => {
  console.log(JSON.stringify(user))
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  }
}