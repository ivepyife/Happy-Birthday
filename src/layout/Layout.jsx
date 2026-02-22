import React from 'react'
import { Outlet } from 'react-router'
import HeartTransition from '../components/HeartTransition'

const Layout = () => {
  return (
    <>
        <HeartTransition />
        <Outlet />
    </>
  )
}

export default Layout