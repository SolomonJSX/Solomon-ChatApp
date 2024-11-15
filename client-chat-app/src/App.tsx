import React, { PropsWithChildren, useEffect, useState } from 'react'
import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import Auth from './pages/auth'
import Profile from './pages/profile'
import Chat from './pages/chat'
import { useAppStore } from './store'
import apiClient from './lib/api-client'
import { GET_USER_INFO_ROUTE as GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { userInfo } = useAppStore()
  const isAuthenticated: boolean = !!userInfo
  return isAuthenticated ? children : <Navigate to="/auth"/>
}

const AuthRoute = ({children}: PropsWithChildren) => {
  const { userInfo } = useAppStore()
  const isAuthenticated: boolean = !!userInfo
  return isAuthenticated ? <Navigate to="/chat"/> : children
}

function App() {
  const {userInfo, setUserInfo} = useAppStore()
  const [loading, setLoading] = useState<Boolean>(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true
        } 
      )
      console.log({response})
      } catch (error) {
        console.log(error)
      }
    };

    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <div>Loading...</div>
  }

  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          <AuthRoute>
            <Auth/>
          </AuthRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute>
            <Chat/>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile/>
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/auth"/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
