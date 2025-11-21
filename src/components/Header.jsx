import { Moon } from 'lucide-react'
import React from 'react'

const Header = ({ setTheme }) => {

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  return (
    <div className='bg-[var(--Header)] flex flex-row items-center justify-between lg:px-15 md:px-15 px-6 py-5 border-b-4 border-[#11151708]'>
      <h1 className='lg:text-2xl text-[var(--Heading)] font-semibold md:text-2xl text-xl'>Where in the world?</h1>
      <div onClick={toggleTheme} className='flex flex-row items-center gap-3 cursor-pointer'>
        <Moon color='var(--Heading)' size={20} />
        <h3 className="title text-[var(--Heading)] font-semibold">Dark Mode</h3>
      </div>
    </div>
  )
}

export default Header