"use client"

import Card from '@/components/Card'
import { ChevronDown, Search } from 'lucide-react'
import React, { useState } from 'react'

const Home = () => {

  const [search, setSearch] = useState("")
  const [region, setRegion] = useState("")

  return (
    <div className='bg-[var(--Main)] h-screen w-full'>
      <div className='flex lg:flex-row md:flex-row lg:px-15 md:px-15 px-6 py-9 flex-col lg:justify-between lg:items-center md:justify-between md:items-center gap-6'>
        <div className='relative flex-1'>
          <Search className='absolute cursor-pointer left-6 top-[50%] translate-y-[-50%] text-[var(--Input)]' size={21} />
          <input
            type="text"
            placeholder="Search for a country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='py-3.5 cursor-pointer pl-18 pr-3.5 rounded-[.3rem] lg:w-md md:w-md sm:w-md w-[100%] shadow text-[var(--Input)] focus:outline-none bg-[var(--Header)]'
          />
        </div>
        <div className="relative inline-block w-52">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-[var(--Header)] text-[var(--Heading)] rounded-md shadow-md px-5 pr-10 py-3 text-[15px] cursor-pointer focus:outline-none appearance-none"
          >
            <option value="">Filter by Region</option>
            <option value="Africa">Africa</option>
            <option value="Americas">America</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>


          {/* Arrow icon */}
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-300">
            <ChevronDown size={18} strokeWidth={3} />
          </span>
        </div>

      </div>
      <Card search={search} region={region} />

    </div>
  )
}

export default Home