"use client"
import Header from '@/components/Header'
import React, { useState } from 'react'
import Home from './Home/page'

const page = () => {

  const [theme, setTheme] = useState('dark')

  return (
    <div className={theme}>
      <Header theme={theme} setTheme={setTheme} />
      <Home />
    </div>
  )
}

export default page